"use client"

import { useState, useRef, useCallback } from "react"
import { Plus, X, Image as ImageIcon, Play, Pause, Eye } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { StatusViewer } from "./status-viewer"

interface Story {
  id: string
  username: string
  userImage: string
  media: string
  type: "image" | "video"
  timestamp: Date
  views: number
  isLive?: boolean
}

const demoStories: Story[] = [
  {
    id: "1",
    username: "Your Story",
    userImage: "/avatars/user.png",
    media: "/stories/placeholder1.jpg",
    type: "image",
    timestamp: new Date(),
    views: 0
  },
  {
    id: "2",
    username: "kasinath",
    userImage: "/avatars/kasinath.jpg",
    media: "/stories/placeholder2.jpg",
    type: "image",
    timestamp: new Date(),
    views: 1200,
    isLive: true
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
  const [stories] = useState<Story[]>(demoStories)
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressInterval = useRef<NodeJS.Timeout>()

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Handle file upload logic here
    }
  }, [])

  const startProgressTimer = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    setProgress(0)
    setIsPlaying(true)

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval.current)
          return 100
        }
        return prev + 0.5
      })
    }, 30)
  }, [])

  return (
    <div className="relative bg-background/80 backdrop-blur-sm border-y">
      {/* Gradient overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Stories container */}
      <div className="flex items-center gap-4 py-4 px-6 overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {/* Add Story Button */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2 snap-start">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/50 p-1 bg-muted/30">
              <Button
                variant="ghost"
                className="w-full h-full rounded-full hover:bg-primary/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="h-6 w-6 text-primary" />
              </Button>
            </div>
            <div className="absolute -bottom-1 right-0 bg-primary text-primary-foreground rounded-full p-1 shadow-lg border-2 border-background">
              <Plus className="h-3 w-3" />
            </div>
          </motion.div>
          <span className="text-xs font-medium">Your Story</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </div>

        {/* Stories */}
        {stories.filter(s => s.username !== "Your Story").map((story) => (
          <motion.button
            key={story.id}
            className="flex-shrink-0 flex flex-col items-center gap-2 snap-start"
            onClick={() => {
              setSelectedStory(story)
              startProgressTimer()
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className={cn(
                "w-16 h-16 rounded-full p-[2px]",
                story.isLive 
                  ? "bg-gradient-to-tr from-red-500 via-red-500 to-rose-500 animate-pulse"
                  : "bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-pink-500",
                "hover:from-fuchsia-600 hover:via-purple-600 hover:to-pink-600"
              )}>
                <div className="w-full h-full rounded-full p-[2px] bg-background">
                  <Avatar className="w-full h-full border-2 border-background">
                    <img 
                      src={story.userImage} 
                      alt={story.username} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  </Avatar>
                </div>
              </div>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-xs font-medium truncate w-20">{story.username}</p>
              {story.isLive ? (
                <span className="text-[10px] text-red-500 font-semibold tracking-wide">LIVE</span>
              ) : (
                <p className="text-[10px] text-muted-foreground">
                  {story.views > 0 ? `${story.views.toLocaleString()} views` : 'No views'}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedStory && (
          <StatusViewer
            stories={stories}
            initialStoryIndex={stories.findIndex(s => s.id === selectedStory.id)}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
