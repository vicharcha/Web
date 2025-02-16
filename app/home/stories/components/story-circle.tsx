"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface StoryCircleProps {
  story: {
    id: string;
    userId: string;
    username: string;
    userImage: string;
    items: Array<{ id: string; url: string; type: "image" | "video" }>;
    createdAt: Date;
    seen?: boolean;
    isNew?: boolean;
  };
  onPress: () => void;
  loading?: boolean;
}

export function StoryCircle({ story, onPress, loading }: StoryCircleProps) {
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
      className="flex flex-col items-center gap-1 focus:outline-none"
      onClick={onPress}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <div 
          className={cn(
            "p-[2px] rounded-full",
            loading ? "bg-muted animate-pulse" :
            story.seen ? "bg-gray-300" : 
            story.isNew ? "bg-gradient-to-tr from-green-400 to-blue-500" :
            "bg-gradient-to-tr from-yellow-400 to-fuchsia-600",
            isHovering && "scale-105 transition-transform"
          )}
        >
          <div className="p-[2px] bg-background rounded-full">
            <Avatar className="h-14 w-14 border-2 border-background relative">
              <AvatarImage 
                src={story.userImage} 
                alt={story.username}
                className="object-cover"
              />
            </Avatar>
            {story.items.length > 1 && (
              <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                {story.items.length}
              </div>
            )}
          </div>
        </div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs truncate w-16 text-center">{story.username}</span>
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
