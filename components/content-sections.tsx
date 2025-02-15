"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoriesPage from "@/app/stories/page";
import { CreatePost } from "@/components/create-post";
import { Post as PostComponent } from "@/components/feed-post";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth-provider";
import type { Post } from "@/lib/types";
import { ShareDialog } from "@/components/share-dialog";
import { CommentDialog } from "@/components/comment-dialog";

export function ContentSections() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("General");

  const fetchPosts = useCallback(async () => {
    try {
      const queryParams = new URLSearchParams();
      if (user?.phoneNumber) {
        queryParams.append('userId', user.phoneNumber);
      }
      queryParams.append('category', selectedCategory.toLowerCase());

      const response = await fetch(`/api/posts?${queryParams}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load posts",
      });
    } finally {
      setLoading(false);
    }
  }, [user, selectedCategory, toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const categories = ["Posts", "Stories"] as const;
  const [shareDialogPost, setShareDialogPost] = useState<Post | null>(null);
  const [commentDialogPost, setCommentDialogPost] = useState<Post | null>(null);

  return (
    <div className="w-full space-y-6">
      <div className="border-b pb-4">
        <StoriesPage />
      </div>

      <div className="mt-6">
        <CreatePost onPostCreated={fetchPosts} />
      </div>

      <Tabs defaultValue="Posts" className="w-full" onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Posts" className="mt-6 space-y-4">
          {loading ? (
            <div>Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center text-muted-foreground">No posts yet</div>
          ) : (
            posts.map((post) => (
              <PostComponent 
                key={post.id} 
                post={post} 
                onLike={async (postId) => {
                  const response = await fetch('/api/social/like', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId, userId: user?.phoneNumber })
                  });
                  if (response.ok) fetchPosts();
                }}
                onComment={(postId) => setCommentDialogPost(posts.find(p => p.id === postId) || null)}
                onShare={(postId) => setShareDialogPost(posts.find(p => p.id === postId) || null)}
                onSave={async (postId) => {
                  const response = await fetch('/api/social/bookmark', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId, userId: user?.phoneNumber })
                  });
                  if (response.ok) fetchPosts();
                }}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="Stories" className="mt-6">
          <StoriesPage />
        </TabsContent>
      </Tabs>

      {shareDialogPost && (
        <ShareDialog
          isOpen={!!shareDialogPost}
          onClose={() => setShareDialogPost(null)}
          post={shareDialogPost}
        />
      )}

      {commentDialogPost && (
        <CommentDialog
          isOpen={!!commentDialogPost}
          onClose={() => setCommentDialogPost(null)}
          post={commentDialogPost}
          onAddComment={async (comment) => {
            if (!user || !comment.trim()) return;
            
            const response = await fetch('/api/social/comment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                postId: commentDialogPost.id,
                userId: user.phoneNumber,
                content: comment
              }),
            });
            
            if (response.ok) {
              fetchPosts();
              setCommentDialogPost(null);
            }
          }}
        />
      )}
    </div>
  );
}
