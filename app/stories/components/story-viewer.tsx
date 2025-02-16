"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Pause, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Story } from "@/lib/types";

interface StoryViewerProps {
  stories: Story[];
  initialStoryIndex: number;
  onClose: () => void;
}

export function StoryViewer({ stories, initialStoryIndex, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const currentStory = stories[currentIndex];

  // Reset video and progress when story changes
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(console.error);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!currentStory) return;

    let timer: NodeJS.Timeout;
    
    if (currentStory.type === 'image') {
      const duration = 5000; // 5 seconds for images
      const interval = 100; // Update progress every 100ms
      const steps = duration / interval;
      let currentStep = 0;

      timer = setInterval(() => {
        if (isPlaying) {
          currentStep++;
          setProgress((currentStep / steps) * 100);

          if (currentStep >= steps) {
            handleNext();
          }
        }
      }, interval);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStory, isPlaying]);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      setProgress((currentTime / duration) * 100);
      
      if (currentTime >= duration) {
        handleNext();
      }
    }
  };

  const handleVideoError = (error: any) => {
    console.error('Video error:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to play video"
    });
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] h-[calc(100vh-64px)] p-0 aspect-[9/16] mx-auto">
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
          {/* Progress bar */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            {stories.map((story, index) => (
              <div key={story.id} className="h-0.5 flex-1 bg-gray-600">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ 
                    width: index === currentIndex ? `${progress}%` : 
                           index < currentIndex ? '100%' : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info with timestamp */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <img
                src={currentStory.userImage || '/placeholder-user.jpg'}
                alt={currentStory.username || 'User'}
                className="w-8 h-8 rounded-full object-cover border border-white/20"
              />
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">{currentStory.username || 'User'}</span>
                <span className="text-white/70 text-xs">{new Date(currentStory.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Media content */}
          <div className="w-full h-full flex items-center justify-center" onClick={togglePlayPause}>
            {currentStory.type === 'video' ? (
              <video
                ref={videoRef}
                src={currentStory.mediaUrl}
                className="max-h-full w-full object-contain"
                playsInline
                onTimeUpdate={handleVideoTimeUpdate}
                onError={handleVideoError}
                muted
              />
            ) : (
              <img
                src={currentStory.mediaUrl}
                alt=""
                className="max-h-full w-full object-contain"
              />
            )}
          </div>

          {/* Navigation buttons */}
          <div className="absolute inset-0 flex items-center justify-between px-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-black/20"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-black/20"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              disabled={currentIndex === stories.length - 1}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </div>

          {/* Play/Pause and Download buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            {currentStory.type === 'video' && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-black/20"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            )}
            {currentStory.downloadable && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-black/20"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (isDownloading) return;
                  
                  setIsDownloading(true);
                  try {
                    const response = await fetch(`/api/stories/download?storyId=${currentStory.id}`);
                    if (!response.ok) throw new Error('Failed to get download URL');
                    
                    const data = await response.json();
                    if (!data.success) throw new Error(data.error);
                    
                    const link = document.createElement('a');
                    link.href = currentStory.mediaUrl;
                    link.download = `story-${currentStory.id}.${currentStory.type === 'video' ? 'mp4' : 'jpg'}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    toast({
                      title: "Success",
                      description: "Download started successfully"
                    });
                  } catch (error) {
                    console.error('Download error:', error);
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Failed to download story"
                    });
                  } finally {
                    setIsDownloading(false);
                  }
                }}
                disabled={isDownloading}
              >
                <Download className={cn("h-6 w-6", isDownloading && "animate-pulse")} />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
