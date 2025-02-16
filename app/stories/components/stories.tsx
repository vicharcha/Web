"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Plus, ChevronLeft, ChevronRight, X, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Story {
  id: number
  username: string
  userImage: string
  storyImage: string
  isViewed: boolean
  isPremium?: boolean
  duration?: number
  type?: string
}

interface APIStory {
  id: string
  userId: string
  username: string
  userImage: string
  items: {
    id: string
    url: string
    type: string
    duration?: number
  }[]
  category: string
  tokens: number
  downloadable: boolean
  isAdult: boolean
}

export function Stories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [videoReady, setVideoReady] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories')
        if (!response.ok) throw new Error('Failed to fetch stories')
    
        const data = await response.json()
    
        const apiStories: APIStory[] = Object.values(data.stories).flat() as APIStory[]
    
        const transformedStories = apiStories.map((story) => ({
          id: Number(story.id),
          username: story.username,
          userImage: story.userImage || '/placeholder-user.jpg',
          storyImage: story.items[0]?.url || '/placeholder.jpg',
          isViewed: false,
          isPremium: story.tokens > 0,
          duration: story.items[0]?.duration || 5,
          type: story.items[0]?.type || 'image'
        }))
    
        setStories(transformedStories)
      } catch (error) {
        console.error("Error fetching stories:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load stories. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchStories()
  }, [toast])

  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [soundLevel, setSoundLevel] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (selectedStory && isPlaying && !isMuted) {
      interval = setInterval(() => {
        setSoundLevel(Math.random() * 100)
      }, 100)
    } else {
      setSoundLevel(0)
    }

    return () => clearInterval(interval)
  }, [selectedStory, isPlaying, isMuted])

  const handleStoryClick = (story: Story) => {
    setProgress(0)
    setIsPlaying(true)
    setIsMuted(false)
    setSoundLevel(0)
    setSelectedStory(story)

    setStories(prev =>
      prev.map(s => s.id === story.id ? { ...s, isViewed: true } : s)
    )
  }

  const handleClose = () => {
    setSelectedStory(null)
    setProgress(0)
    setIsPlaying(false)
  }

  const handleNext = () => {
    if (!selectedStory) return

    const currentIndex = stories.findIndex(s => s.id === selectedStory.id)
    if (currentIndex < stories.length - 1) {
      handleStoryClick(stories[currentIndex + 1])
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (!selectedStory) return

    const currentIndex = stories.findIndex(s => s.id === selectedStory.id)
    if (currentIndex > 0) {
      handleStoryClick(stories[currentIndex - 1])
    }
  }

  return (
    <>
      {loading ? (
        <Card className="p-4 mb-4 relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 px-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0">
                <Skeleton className="w-[72px] h-[100px] rounded-xl" />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="p-4 mb-4 relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 px-1">
            {stories.map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <Button
                  variant="ghost"
                  className="w-[72px] h-[100px] p-0 overflow-hidden relative group rounded-xl cursor-pointer"
                  onClick={() => handleStoryClick(story)}
                >
                  <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                    {story.type === 'video' ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <Play className="h-6 w-6 text-white/70" />
                      </div>
                    ) : (
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${story.storyImage})` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  </div>
                  <div className="absolute inset-x-0 top-2 flex justify-center">
                    <div className={cn(
                      "w-16 h-16 rounded-full p-[3px]",
                      story.isViewed ? "bg-muted"
                        : story.isPremium ? "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500"
                          : "bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500",
                      "transition-all duration-300 ease-in-out"
                    )}>
                      <Avatar className="w-full h-full border-2 border-background">
                        <AvatarImage src={story.userImage} />
                        <AvatarFallback>{story.username[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </>
  )
}
