"use client"

import { useState, useRef, useCallback } from "react"
import { Plus, X, Image, Play, Pause, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Story {
  id: string
  username: string
  userImage: string
  media: string
  type: "image" | "video"
  timestamp: Date
  views: number
}

const demoStories: Story[] = [
  {
    id: "1",
    username: "Your Story",
    userImage: "/placeholder.svg",
    media: "/placeholder.jpg",
    type: "image",
    timestamp: new Date(),
    views: 0
  },
  {
    id: "2",
    username: "frontlines",
    userImage: "/placeholder.svg",
    media: "/placeholder.jpg",
    type: "image",
    timestamp: new Date(),
    views: 1200000
  },
  {
    id: "3",
    username: "lohithsai",
    userImage: "/placeholder.svg",
    media: "/placeholder.jpg",
    type: "image",
    timestamp: new Date(),
    views: 856000
  },
  {
    id: "4",
    username: "lizz_nikzz",
    userImage: "/placeholder.svg",
    media: "/placeholder.jpg",
    type: "image",
    timestamp: new Date(),
    views: 2100000
  },
  {
    id: "5",
    username: "olgakay",
    userImage: "/placeholder.svg",
    media: "/placeholder.jpg",
    type: "image",
    timestamp: new Date(),
    views: 543000
  },
  {
    id: "6",
    username: "krishna_ta",
    userImage: "/placeholder.svg",
    media: "/placeholder.jpg",
    type: "image",
    timestamp: new Date(),
    views: 1500000
  }
]

function formatViews(views: number): string {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`
  }
  return `${views} views`
}

export function StatusSection() {
  const [stories, setStories] = useState<Story[]>(demoStories)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [storyProgress, setStoryProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressInterval = useRef<NodeJS.Timeout>()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert("File too large. Maximum size is 100MB")
        return
      }

      setIsUploading(true)
      // Simulate upload
      setTimeout(() => {
        const newStory: Story = {
          id: Math.random().toString(),
          username: "Your Story",
          userImage: "/placeholder.svg",
          media: URL.createObjectURL(file),
          type: file.type.startsWith("image/") ? "image" : "video",
          timestamp: new Date(),
          views: 0
        }
        setStories([newStory, ...stories.filter(s => s.username !== "Your Story")])
        setIsUploading(false)
      }, 1500)
    }
  }

  const startProgressTimer = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    setStoryProgress(0)
    setIsPlaying(true)

    progressInterval.current = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current)
          return 100
        }
        return prev + 0.5
      })
    }, 30)
  }, [])

  const handleStoryOpen = (story: Story) => {
    setSelectedStory(story)
    startProgressTimer()
  }

  const handleStoryClose = () => {
    setSelectedStory(null)
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (isPlaying) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    } else {
      startProgressTimer()
    }
  }

  return (
    <div className="py-4 relative">
      <div 
        className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide touch-pan-x cursor-grab active:cursor-grabbing"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-1 min-w-[80px] cursor-pointer group">
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="w-16 h-16 rounded-full border-2 border-dashed group-hover:border-primary transition-colors duration-200"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Plus className="h-6 w-6" />
                </motion.div>
              ) : (
                <Plus className="h-6 w-6" />
              )}
            </Button>
            <div className="absolute -bottom-1 right-0 bg-primary text-primary-foreground rounded-full p-1 shadow-lg border-2 border-background">
              <Plus className="h-3 w-3" />
            </div>
          </div>
          <span className="text-sm font-medium">Your Story</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </div>

        {/* Story Previews */}
        {stories.filter(s => s.username !== "Your Story").map((story, index) => (
          <button
            key={story.id}
            className="flex flex-col items-center gap-1 min-w-[80px] group"
            style={{ scrollSnapAlign: 'start' }}
            onClick={() => handleStoryOpen(story)}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-violet-500 p-[2px] group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-background rounded-full p-[2px]">
                  <Avatar className="w-16 h-16 border-2 border-background">
                    <AvatarImage src={story.userImage} alt={story.username} />
                    <AvatarFallback>{story.username[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <span className="text-sm font-medium">{story.username}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(story.views)}
            </span>
          </button>
        ))}
      </div>

      {/* Story View Dialog */}
      <AnimatePresence>
        {selectedStory && (
          <Dialog open={true} onOpenChange={handleStoryClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden bg-black">
              <DialogHeader className="absolute top-0 left-0 right-0 z-10">
                <Progress 
                  value={storyProgress} 
                  className="h-1 rounded-none [&>div]:bg-white bg-white/20"
                />
              </DialogHeader>
              <div className="relative aspect-[9/16]">
                {selectedStory.type === "image" ? (
                  <img
                    src={selectedStory.media}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={selectedStory.media}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                  />
                )}
                
                {/* Controls */}
                <div className="absolute top-4 right-4 space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={handleStoryClose}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-white">
                    <AvatarImage src={selectedStory.userImage} alt={selectedStory.username} />
                    <AvatarFallback>{selectedStory.username[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <p className="font-medium">{selectedStory.username}</p>
                    <p className="text-sm opacity-80 flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {formatViews(selectedStory.views)}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
