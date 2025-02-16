"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { StoryCircle, StoryCircleSkeleton } from "./components/story-circle";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StoryViewer } from "@/app/stories/components/story-viewer";
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
    const scrollAmount = 300; // Adjust scroll amount as needed
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  const checkScrollable = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScroll({
        left: container.scrollLeft > 0,
        right: container.scrollLeft < container.scrollWidth - container.clientWidth
      });
    }
  };

  // Update scroll state when stories change or container changes
  useEffect(() => {
    const handleUpdate = () => {
      requestAnimationFrame(checkScrollable);
    };

    const container = scrollContainerRef.current;
    if (container) {
      const observer = new ResizeObserver(handleUpdate);
      observer.observe(container);

      container.addEventListener('scroll', handleUpdate);
      handleUpdate();

      return () => {
        observer.disconnect();
        container.removeEventListener('scroll', handleUpdate);
      };
    }
  }, [stories.length]); // Only re-run when stories change

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto py-4">
        <div className="relative">
          {/* Scroll buttons */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm",
              !canScroll.left && "opacity-0 pointer-events-none"
            )}
            onClick={() => handleScroll('left')}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm",
              !canScroll.right && "opacity-0 pointer-events-none"
            )}
            onClick={() => handleScroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Stories container */}
          <ScrollArea className="w-full whitespace-nowrap pb-4 -mx-2 px-2">
            <div 
              ref={scrollContainerRef}
              className="flex gap-4 items-start min-h-[120px]"
            >
              {loading ? (
                <>
                  <CreateStory onStoryCreated={fetchStories} />
                  {[1, 2, 3, 4, 5].map((n) => (
                    <StoryCircleSkeleton key={n} />
                  ))}
                </>
              ) : (
                <>
                  <CreateStory onStoryCreated={fetchStories} />
                  {stories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <StoryCircle
                        story={story}
                        onPress={() => handleStoryPress(index)}
                      />
                    </motion.div>
                  ))}
                </>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
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
    </div>
  );
}
