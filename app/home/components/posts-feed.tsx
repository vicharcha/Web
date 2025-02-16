"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/components/auth-provider"
import { Post } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function PostsFeed({ category = "general" }: { category?: string }) {
  const { user } = useAuth();
  const [internalPosts, setInternalPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?category=${category}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const posts = await response.json();
        setInternalPosts(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [category]);

  const handleCreatePost = async () => {
    if (newPost.trim() === '') return;

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || '1234567890',
          content: newPost,
          category,
          mediaUrls: []
        })
      });

      if (!response.ok) throw new Error('Failed to create post');
      const createdPost = await response.json();
      setInternalPosts([createdPost, ...internalPosts]);
      setNewPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      setInternalPosts(internalPosts.map(post => 
        post.id === postId ? 
          { ...post, likes: post.likes + 1, isLiked: true } : 
          post
      ));
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleComment = async (postId: string, comment: string) => {
    if (!comment.trim()) return;
    
    try {
      setInternalPosts(internalPosts.map(post => 
        post.id === postId ? 
          { ...post, comments: post.comments + 1 } : 
          post
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-4 p-4 bg-card rounded-lg border">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="w-full p-2 bg-background border rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="What's on your mind?"
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <Button
            onClick={handleCreatePost}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Post
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {internalPosts.map(post => (
          <div key={post.id} className="p-4 bg-card rounded-lg border">
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={post.userImage} alt={post.username} />
                <AvatarFallback>{post.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{post.username}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <p className="mb-4">{post.content}</p>
            
            {post.mediaUrls.length > 0 && (
              <div className="mb-4">
                {post.mediaUrls.map((url, index) => (
                  <img 
                    key={index} 
                    src={url} 
                    alt={`Media ${index + 1}`} 
                    className="max-w-full rounded"
                  />
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-muted-foreground">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(post.id)}
                className={post.isLiked ? "text-primary" : ""}
              >
                ❤️ {post.likes}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleComment(post.id, prompt('Enter your comment:') || '')}
              >
                💬 {post.comments}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
              >
                🔗 {post.shares}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
