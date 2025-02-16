"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { Story } from "@/lib/types";

interface StoryCircleProps {
  story: Story;
  onPress: () => void;
  loading?: boolean;
  animate?: boolean;
}

export function StoryCircle({ story, onPress, loading, animate = true }: StoryCircleProps) {
  const [isHovering, setIsHovering] = useState(false);

  // Format time elapsed
  const getTimeElapsed = () => {
    const now = new Date();
    const createdAt = new Date(story.createdAt);
    const diff = Math.floor((now.getTime() - createdAt.getTime()) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      className="flex flex-col items-center gap-2"
      onClick={onPress}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        <div 
          className={cn(
            "p-1 rounded-full",
            loading ? "bg-muted animate-pulse" :
            story.isViewed ? "bg-gray-300" : 
            story.isPremium ? "bg-gradient-to-tr from-green-400 to-blue-500" :
            "bg-gradient-to-tr from-yellow-400 to-fuchsia-600",
            "transition-transform duration-200",
            isHovering && "scale-105"
          )}
        >
          <div className="p-0.5 bg-background rounded-full">
            <Avatar className="h-14 w-14 ring-2 ring-background">
              <AvatarImage 
                src={story.userImage || '/placeholder-user.jpg'} 
                alt={story.username || 'User'}
                className="object-cover"
              />
              <AvatarFallback>{(story.username ?? 'U')[0]}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs font-medium truncate max-w-[80px]">{story.username || 'User'}</span>
        <span className="text-[10px] text-muted-foreground">{getTimeElapsed()}</span>
      </div>
    </motion.button>
  );
}

export function StoryCircleSkeleton() {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-[62px] h-[62px] rounded-full bg-muted animate-pulse" />
      <div className="w-12 h-3 bg-muted animate-pulse rounded" />
    </div>
  );
}
