"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StoryItem {
  id: string;
  url: string;
  type: "image" | "video";
  duration?: number; // in seconds, for videos
}

interface Story {
  id: string;
  userId: string;
  userImage: string;
  username: string;
  items: StoryItem[];
}

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

export function StoryViewer({ stories, initialStoryIndex, onClose }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentStory = stories[currentStoryIndex];
  const currentItem = currentStory?.items[currentItemIndex];

  useEffect(() => {
    if (!currentItem) return;

    const duration = currentItem.type === 'video' ? 
      (currentItem.duration || 10) * 1000 : 
      5000; // 5 seconds for images

    const interval = 100; // Update progress every 100ms
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        // Move to next item or story
        if (currentItemIndex < currentStory.items.length - 1) {
          setCurrentItemIndex(prev => prev + 1);
          setProgress(0);
        } else if (currentStoryIndex < stories.length - 1) {
          setCurrentStoryIndex(prev => prev + 1);
          setCurrentItemIndex(0);
          setProgress(0);
        } else {
          onClose();
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [currentItem, currentItemIndex, currentStoryIndex, currentStory.items.length, stories.length, onClose]);

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
      setProgress(0);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentItemIndex(stories[currentStoryIndex - 1].items.length - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentItemIndex < currentStory.items.length - 1) {
      setCurrentItemIndex(prev => prev + 1);
      setProgress(0);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentItemIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] p-0">
        <div className="relative h-full flex items-center justify-center bg-black">
          {/* Progress bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {currentStory.items.map((item, index) => (
              <div key={item.id} className="h-0.5 flex-1 bg-gray-600">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ 
                    width: index === currentItemIndex ? `${progress}%` : 
                           index < currentItemIndex ? '100%' : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info */}
          <div className="absolute top-8 left-4 flex items-center gap-2">
            <img
              src={currentStory.userImage}
              alt={currentStory.username}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-white font-semibold">{currentStory.username}</span>
          </div>

          {/* Media content */}
          <div className="w-full h-full flex items-center justify-center">
            {currentItem.type === 'video' ? (
              <video
                src={currentItem.url}
                className="max-h-full aspect-[9/16] object-contain"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <img
                src={currentItem.url}
                alt=""
                className="max-h-full aspect-[9/16] object-contain"
              />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-black/20"
              onClick={handlePrevious}
              disabled={currentStoryIndex === 0 && currentItemIndex === 0}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-black/20"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
