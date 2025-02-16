"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { StoryCircle, StoryCircleSkeleton } from "./components/story-circle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoryViewer } from "@/app/stories/components/story-viewer";
import { CreateStory } from "./components/create-story";
import { motion, AnimatePresence } from "framer-motion";

import { Story } from "@/lib/types";

const transformStoryData = (story: any): Story => ({
  id: story.id,
  userId: story.userId,
  username: story.username,
  userImage: story.userImage || '/placeholder-user.jpg',
  type: story.type,
  mediaUrl: story.mediaUrl,
  duration: story.duration,
  isViewed: story.isViewed || false,
  isPremium: story.isPremium || false,
  category: story.category || 'general',
  downloadable: story.downloadable || true,
  isAdult: story.isAdult || false,
  createdAt: story.createdAt,
  expiresAt: story.expiresAt
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
      const transformedStories = storyData
        .map(transformStoryData)
        .sort((a: Story, b: Story) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
