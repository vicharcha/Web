"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import type { Post } from "@/lib/types";

export function ContentSections() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("General");
  
  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts?category=${selectedCategory.toLowerCase()}`);
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
  }, [selectedCategory, toast]);

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
    <div className="w-full">
      <Tabs defaultValue="General" className="w-full" onValueChange={setSelectedCategory}>
        <TabsList className="w-full justify-start bg-background/50 backdrop-blur-sm p-1 rounded-lg">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
              <div className="space-y-4 mt-4">
                {loading ? (
                  // Loading skeleton
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="animate-pulse">
                        <div className="h-48 bg-muted rounded-lg" />
                      </div>
                    ))}
                  </div>
                ) : (
                  posts.filter(post => {
                    const postCat = post.category?.toLowerCase() || "general";
                    const selectedCat = category.toLowerCase();
                    return selectedCat === "general" ? 
                      postCat === "general" || !postCat : 
                      postCat === selectedCat;
                  }).map(post => (
                    <article key={post.id} className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                          <img src={post.userImage} alt={post.username} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold">{post.username}</p>
                          <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                        </div>
                      </div>
                      <p className="text-base leading-relaxed">{post.content}</p>
                      {post.mediaUrls?.[0] && (
                        <div className="relative aspect-video rounded-lg overflow-hidden">
                          <img src={post.mediaUrls[0]} alt="Post content" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </article>
                  ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
