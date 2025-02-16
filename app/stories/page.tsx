"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { StoryCircle, StoryCircleSkeleton } from "./components/story-circle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoryViewer } from "@/app/stories/components/story-viewer";
import { CreateStory } from "./components/create-story";
import { motion, AnimatePresence } from "framer-motion";

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
  seen?: boolean;
  createdAt: Date;
}

const transformStoryData = (story: any): Story => ({
  ...story,
  createdAt: new Date(story.createdAt),
  seen: story.seen || false,
  isNew: false // Add isNew property based on creation time if needed
});

export default function StoriesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchStories();
  }, [user]);

  const fetchStories = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (user?.phoneNumber) {
        queryParams.append('userId', user.phoneNumber);
      }

      const response = await fetch(`/api/stories?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const { stories: storyData } = await response.json();
      const transformedStories = Object.values(storyData)
        .flat()
        .map(transformStoryData)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setStories(transformedStories);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load stories",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStoryPress = (index: number) => {
    setSelectedStoryIndex(index);
  };

  if (loading) {
    return (
      <div className="w-full p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 p-1">
            <CreateStory onStoryCreated={fetchStories} />
            {[1, 2, 3].map((n) => (
              <StoryCircleSkeleton key={n} />
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <motion.div
            className="flex gap-4 p-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CreateStory onStoryCreated={fetchStories} />
            {stories.map((story, index) => (
              <StoryCircle
                key={story.id}
                story={story}
                onPress={() => handleStoryPress(index)}
              />
            ))}
          </motion.div>
        </ScrollArea>
      </div>

      <AnimatePresence>
        {selectedStoryIndex !== null && (
          <StoryViewer
            stories={stories}
            initialStoryIndex={selectedStoryIndex}
            onClose={() => setSelectedStoryIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
