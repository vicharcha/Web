"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { StoryCircle, StoryCircleSkeleton } from "./components/story-circle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StoryViewer } from "./components/story-viewer";
import { CreateStory } from "./components/create-story";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Story } from "@/lib/types";

export default function StoriesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

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

      const data = await response.json();
      setStories(data.stories);
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

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  // Check scrollable state
  useEffect(() => {
    const handleUpdate = () => {
      const container = scrollContainerRef.current;
      if (container) {
        const maxScroll = container.scrollWidth - container.clientWidth;
        setCanScroll({
          left: container.scrollLeft > 0,
          right: container.scrollLeft < maxScroll - 1 // -1 for rounding errors
        });
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      // Initial check
      handleUpdate();

      // Set up observers
      const observer = new ResizeObserver(handleUpdate);
      observer.observe(container);

      // Listen for scroll events
      container.addEventListener('scroll', handleUpdate);

      return () => {
        observer.disconnect();
        container.removeEventListener('scroll', handleUpdate);
      };
    }
  }, [stories.length]);

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6 bg-white text-black">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-purple-500/5 to-blue-500/5 rounded-xl blur-xl" />
        <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-gray-100 bg-white/50 backdrop-blur-sm">
          <div className="flex w-max space-x-4 p-4">
            <CreateStory onStoryCreated={fetchStories} />
            
            {loading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <StoryCircleSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                {stories.map((story, index) => (
                  <StoryCircle
                    key={story.id}
                    story={story}
                    onPress={() => handleStoryPress(index)}
                  />
                ))}
              </>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <AnimatePresence mode="wait">
        {selectedStoryIndex !== null && (
          <StoryViewer
            stories={stories}
            initialStoryIndex={selectedStoryIndex}
            onClose={() => setSelectedStoryIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
