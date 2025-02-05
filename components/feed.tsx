import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Tweet } from "@/components/tweet";

interface TweetProps {
  username: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  isVerified?: boolean;
  metrics: {
    replies: number;
    retweets: number;
    likes: number;
  };
  images?: string[];
}

interface FeedProps {
  posts: TweetProps[];
}

const Feed: React.FC<FeedProps> = ({ posts }) => {
  // Add sample posts if none provided
  const defaultPosts: TweetProps[] = [
    {
      username: "Sample User",
      handle: "@sampleuser",
      avatar: "/placeholder-avatar.png",
      content: "Welcome to Vicharcha!",
      timestamp: new Date().toISOString(),
      isVerified: true,
      metrics: {
        replies: 0,
        retweets: 0,
        likes: 0
      }
    }
  ];

  const displayPosts = posts.length > 0 ? posts : defaultPosts;

  return (
    <ScrollArea className="h-[calc(100vh-24rem)] min-h-[400px]">
      <div className="space-y-4">
        <AnimatePresence>
          {displayPosts.map((post, index) => (
            <motion.div
              key={post.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Tweet
                username={post.username}
                handle={post.handle}
                avatar={post.avatar}
                content={post.content}
                timestamp={post.timestamp}
                isVerified={post.isVerified}
                metrics={post.metrics}
                images={post.images}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ScrollArea>
  )
}

export default Feed;
