"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoriesPage from "@/app/stories/page";
import { CreatePost } from "@/components/create-post";
import { Post as PostComponent } from "@/components/feed-post";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/components/auth-provider";
import type { Post } from "@/lib/types";

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

  const categories = [
    "General",
    "News",
    "Entertainment",
    "Sports",
    "Technology",
  ] as const;

  return (
    <div className="w-full space-y-6">
      <div className="border-b pb-4">
        <StoriesPage />
      </div>

      <div className="px-4">
        <CreatePost onPostCreated={fetchPosts} />
      </div>

      <Tabs defaultValue="General" className="w-full mt-6" onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="space-y-6">
              {loading ? (
                // Loading skeleton
                <div className="space-y-6">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="animate-pulse">
                      <div className="h-[300px] bg-muted rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (
                posts
                  .filter(post => {
                    const postCat = post.category?.toLowerCase() || "general";
                    const selectedCat = category.toLowerCase();
                    return selectedCat === "general" ? 
                      postCat === "general" || !postCat : 
                      postCat === selectedCat;
                  })
                  .map(post => (
                    <PostComponent
                      key={post.id}
                      post={post}
                      onLike={async (postId) => {
                        try {
                          const response = await fetch('/api/social/like', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ postId, userId: user?.phoneNumber }),
                          });
                          if (!response.ok) throw new Error('Failed to like post');
                          setPosts(posts.map(p => 
                            p.id === postId 
                              ? { ...p, likes: p.likes + 1, isLiked: true }
                              : p
                          ));
                        } catch (error) {
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Failed to like post",
                          });
                        }
                      }}
                      onComment={async (postId) => {
                        // Handle comment
                      }}
                      onShare={async (postId) => {
                        // Handle share
                      }}
                      onSave={async (postId) => {
                        try {
                          const response = await fetch('/api/social/bookmark', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ postId, userId: user?.phoneNumber }),
                          });
                          if (!response.ok) throw new Error('Failed to bookmark post');
                          setPosts(posts.map(p => 
                            p.id === postId 
                              ? { ...p, isBookmarked: !p.isBookmarked }
                              : p
                          ));
                        } catch (error) {
                          toast({
                            variant: "destructive",
                            title: "Error",
                            description: "Failed to bookmark post",
                          });
                        }
                      }}
                    />
                  ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
