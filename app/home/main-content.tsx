"use client"

import { useState, useCallback, useEffect } from "react";
import { useResponsive } from "@/hooks/use-responsive";
import { useML } from "@/contexts/ml-context";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Clock, TrendingUp, Star, Users, Filter } from "lucide-react";
import { CreatePost } from "@/components/create-post";
import { useAuth } from "@/components/auth-provider";
import { useSettings } from "@/hooks/use-settings";
import { PostCategories, Post, MLPostAnalysis, MLRecommendations } from "@/lib/types";
import { Stories } from "@/app/stories/components/stories";
import { Card } from "@/components/ui/card";
import { ContentRatingBadge } from "@/components/ui/content-rating-badge";

const categoryFilters: string[] = ["all", "general", "news", "entertainment", "sports", "technology", "politics"];

interface MainContentProps {
  category: string;
  showStories?: boolean;
  mlAnalysis?: MLPostAnalysis;
  recommendations?: MLRecommendations;
}

export function MainContent({ 
  category, 
  showStories = false,
  mlAnalysis,
  recommendations 
}: MainContentProps) {
  const { user } = useAuth();
  const { settings } = useSettings();
  const { refreshAnalysis } = useML();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { isMobile } = useResponsive();
  const [sortBy, setSortBy] = useState<string>("latest");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Fetch all posts, then filter in UI
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not load posts." });
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [category, toast, refreshKey]);

  const handleFilterChange = (selectedFilter: string) => {
    setFilterBy(selectedFilter);
    setIsFilterOpen(false);
  };

  if (loading) return <Skeleton className="h-20 w-full" />;

  // Filter and sort posts based on category and ML analysis
  const getFilteredPosts = useCallback((posts: Post[]) => {
    let filtered = [...posts];
    
    // Apply category filter if not "all"
    if (filterBy !== "all") {
      filtered = filtered.filter(post => post.category === filterBy);
    }
    
    // Apply ML-based filtering if available
    if (mlAnalysis && recommendations?.recommended_categories?.length) {
      filtered = filtered.filter(post => {
        if (!post.content_rating) return true;
        return recommendations.recommended_categories.includes(post.category);
      });
    }
    
    // Sort by selected sort method
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return filtered;
  }, [mlAnalysis, recommendations, filterBy, sortBy]);

  const refreshPosts = async (newPost?: Post) => {
    try {
      if (newPost) {
        // Optimistically add the new post to the list
        setPosts(prevPosts => [newPost, ...prevPosts]);
        // Refresh ML analysis in background
        refreshAnalysis().catch(console.error);
      } else {
        setLoading(true);
        // Fetch all posts if no new post provided
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data: Post[] = await response.json();
        setPosts(data);
        await refreshAnalysis();
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not refresh posts." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* ML-based recommendations */}
      {recommendations && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Recommended Topics</h3>
          <div className="flex flex-wrap gap-2">
            {recommendations.recommended_categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                onClick={() => setFilterBy(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {showStories && <Stories />}
      
      <CreatePost 
        onPostCreated={(post) => refreshPosts(post)} 
        initialCategory={category} 
      />

      <div className="flex flex-wrap items-center justify-between gap-6 py-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          <Button variant={sortBy === "latest" ? "default" : "outline"} onClick={() => setSortBy("latest")}>
            <Clock className="h-4 w-4 mr-2" /> Latest
          </Button>
          <Button variant={sortBy === "trending" ? "default" : "outline"} onClick={() => setSortBy("trending")}>
            <TrendingUp className="h-4 w-4 mr-2" /> Trending
          </Button>
          <Button variant={sortBy === "top" ? "default" : "outline"} onClick={() => setSortBy("top")}>
            <Star className="h-4 w-4 mr-2" /> Top
          </Button>
          <Button variant={sortBy === "following" ? "default" : "outline"} onClick={() => setSortBy("following")}>
            <Users className="h-4 w-4 mr-2" /> Following
          </Button>
        </div>
        <div className="relative">
          <Button variant="outline" className="gap-2" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <Filter className="h-4 w-4" /> Filter
          </Button>
          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 border rounded-md shadow-lg bg-background z-50">
              {categoryFilters.map(filter => (
                <Button
                  key={filter}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    filterBy === filter ? "bg-muted" : ""
                  )}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {getFilteredPosts(posts).map(post => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.userImage} alt={post.username} />
                    <AvatarFallback>{post.username[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{post.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(post.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                {post.content_rating && (
                  <ContentRatingBadge rating={post.content_rating} />
                )}
              </div>
              
              <div className="mt-3 whitespace-pre-wrap">
                {post.content}
              </div>

              {post.mediaUrls?.length > 0 && (
                <div className="mt-3 grid gap-2">
                  {post.mediaUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt=""
                      className="rounded-lg max-h-96 w-full object-cover"
                    />
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm">
                  {post.likes || 0} Likes
                </Button>
                <Button variant="ghost" size="sm">
                  {post.comments || 0} Comments
                </Button>
                <Button variant="ghost" size="sm">
                  {post.shares || 0} Shares
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
