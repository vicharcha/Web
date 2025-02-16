"use client";

import { useState, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Post as PostComponent } from '@/components/post';  // Renamed to PostComponent
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp, Clock } from "lucide-react";
import { Stories } from '../app/home/stories/components/stories';
import { PostCategories, type Post } from "@/lib/types";
import { useAuth } from "@/components/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FeedProps {
  initialPosts?: Post[];
}

const Feed: React.FC<FeedProps> = ({ initialPosts = [] }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [sortBy, setSortBy] = useState<'new' | 'trending' | 'top'>('new');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const isAdultAllowed = user?.verificationStatus === 'verified';
      const queryParams = new URLSearchParams();
      
      if (user?.phoneNumber) {
        queryParams.append('userId', user.phoneNumber);
      }
      
      if (selectedCategory !== 'all') {
        queryParams.append('category', selectedCategory);
      }
      queryParams.append('userAge', isAdultAllowed ? '18' : '0');

      const response = await fetch(`/api/posts?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data = await response.json();
      setPosts(data.map((post: Post) => ({
        ...post,
        categories: [post.category] // Convert single category to array for Post component
      })));
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Show error state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, user?.phoneNumber]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPosts();
    setIsRefreshing(false);
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    
    try {
      const method = posts.find(p => p.id === postId)?.isLiked ? 'DELETE' : 'POST';
      const response = await fetch('/api/social/like', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userId: user.phoneNumber
        }),
      });

      if (response.ok) {
        const { likes, isLiked } = await response.json();
        setPosts(currentPosts => 
          currentPosts.map(post => 
            post.id === postId 
              ? { ...post, likes, isLiked }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!user) return;
    
    try {
      const method = posts.find(p => p.id === postId)?.isBookmarked ? 'DELETE' : 'POST';
      const response = await fetch('/api/social/bookmark', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          userId: user.phoneNumber
        }),
      });

      if (response.ok) {
        const { isBookmarked } = await response.json();
        setPosts(currentPosts => 
          currentPosts.map(post => 
            post.id === postId 
              ? { ...post, isBookmarked }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const defaultPosts: Post[] = [{
    id: "default",
    userId: "default",
    username: "Sample User",
    userImage: "/placeholder-user.jpg",
    content: "Welcome to the network!",
    category: PostCategories.GENERAL,
    mediaUrls: [],
    tokens: 0,
    mentions: [],
    hashtags: [],
    emojis: [],
    likes: 0,
    comments: 0,
    shares: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timestamp: new Date().toISOString(),
    isLiked: false,
    isBookmarked: false,
    isVerified: false,
    isPremium: false,
    ageRestricted: false
  }];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <div className="space-y-4">
      {/* Feed Controls */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button 
              variant={sortBy === 'new' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('new')}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              New
            </Button>
            <Button
              variant={sortBy === 'trending' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('trending')}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(PostCategories).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                    {value === PostCategories.ADULT && " (18+)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className={`transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="px-4">
        <Stories />
      </div>

      {/* Posts List */}
      <ScrollArea className="h-[calc(100vh-16rem)] min-h-[400px]">
        <div className="space-y-4 px-4">
          <AnimatePresence mode="popLayout">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: index * 0.05 
                }}
              >
                <PostComponent
                  {...post}
                  onLike={() => handleLike(post.id)}
                  onBookmark={() => handleBookmark(post.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Feed;
