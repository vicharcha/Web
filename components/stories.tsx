"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StoryItem {
  id: string;
  url: string;
  type: "image" | "video";
  duration?: number;
}

interface Story {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  items: StoryItem[];
  category: string;
  tokens: number;
  downloadable: boolean;
  isAdult: boolean;
}

interface ViewingState {
  storyIndex: number;
  itemIndex: number;
}

export function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [viewingState, setViewingState] = useState<ViewingState>({
    storyIndex: 0,
    itemIndex: 0,
  });
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/stories");
      if (!response.ok) throw new Error("Failed to fetch stories");
      const data = await response.json();
      setStories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stories");
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (storyIndex: number) => {
    setSelectedStory(stories[storyIndex]);
    setViewingState({ storyIndex, itemIndex: 0 });
    setIsPlaying(true);
  };

  const handleClose = () => {
    setSelectedStory(null);
    setViewingState({ storyIndex: 0, itemIndex: 0 });
    setIsPlaying(false);
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <Skeleton className="w-20 h-32 rounded-lg" />
            </div>
          ))
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          stories.map((story, index) => (
            <motion.div
              key={story.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Button
                variant="ghost"
                className="w-20 h-32 p-0 overflow-hidden relative"
                onClick={() => handleStoryClick(index)}
              >
                <Avatar className="w-10 h-10 border-2 border-background">
                  <AvatarImage src={story.userImage} />
                  <AvatarFallback>{story.username[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
