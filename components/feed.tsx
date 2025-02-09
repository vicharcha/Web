"use client"

import { useState } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Post } from './post'
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, Clock } from "lucide-react"
import { Stories } from './stories'

interface FeedPost {
  id: string | number;
  username: string;
  userImage: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  categories: string[];
  isSponsored?: boolean;
  timestamp: string;
  isPremium?: boolean;
  isVerified?: boolean;
}

interface FeedProps {
  posts: FeedPost[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
  const [sortBy, setSortBy] = useState<'new' | 'trending' | 'top'>('new');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const defaultPosts: FeedPost[] = [
    {
      id: 1,
      username: "Sample User",
      userImage: "/placeholder-user.jpg",
      content: "Welcome to the network!",
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isBookmarked: false,
      categories: ["General"],
      timestamp: new Date().toISOString(),
      isPremium: false,
      isVerified: false
    }
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulating refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
  };

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
                <Post {...post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Feed;
