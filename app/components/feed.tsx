"use client";

import { useState, useEffect } from 'react';
import { useAuth } from "@/components/auth-provider"

import { Post } from '@/lib/types';

export default function Feed() {
  const { user } = useAuth();
  const [internalPosts, setInternalPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts?category=general');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const posts = await response.json();
      setInternalPosts(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  fetchPosts();
}, []);

const handleCreatePost = async () => {
  if (newPost.trim() === '') return;

  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id || '1234567890',
        content: newPost,
        category: 'general',
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
    // In a real app, we would make an API call to update likes
    // For now, just update the UI
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
    // In a real app, we would make an API call to add the comment
    // For now, just update the UI
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
  <div className="w-full max-w-2xl mx-auto p-4">
    <div className="mb-4">
      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="What's on your mind?"
      />
      <button
        onClick={handleCreatePost}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Post
      </button>
    </div>
    <div>
      {internalPosts.map(post => (
        <div key={post.id} className="mb-4 p-4 border rounded">
          <div className="flex items-center mb-2">
            <img src={post.userImage} alt={post.username} className="w-10 h-10 rounded-full mr-2"/>
            <div>
              <h3 className="font-semibold">{post.username}</h3>
              <p className="text-sm text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
            </div>
          </div>
          
          <p className="mb-3">{post.content}</p>
          
          {post.mediaUrls.length > 0 && (
            <div className="mb-3">
              {post.mediaUrls.map((url, index) => (
                <img key={index} src={url} alt={`Media ${index + 1}`} className="max-w-full rounded"/>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-1 ${post.isLiked ? 'text-blue-500' : 'text-gray-500'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {post.likes}
            </button>
            
            <button 
              className="flex items-center gap-1 text-gray-500"
              onClick={() => handleComment(post.id, prompt('Enter your comment:') || '')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {post.comments}
            </button>
            
            <button className="flex items-center gap-1 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {post.shares}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}
