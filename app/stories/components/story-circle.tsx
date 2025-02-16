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
    seen?: boolean;
  };
  onPress: () => void;
}

export function StoryCircle({ story, onPress }: StoryCircleProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.button
      className="flex flex-col items-center gap-1 focus:outline-none"
      onClick={onPress}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div 
        className={cn(
          "p-[2px] rounded-full",
          story.seen ? "bg-gray-300" : "bg-gradient-to-tr from-yellow-400 to-fuchsia-600",
          isHovering && "scale-105 transition-transform"
        )}
      >
        <div className="p-[2px] bg-background rounded-full">
          <Avatar className="h-14 w-14 border-2 border-background">
            <AvatarImage 
              src={story.userImage} 
              alt={story.username}
              className="object-cover"
            />
          </Avatar>
        </div>
      </div>
      <span className="text-xs truncate w-16 text-center">{story.username}</span>
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
