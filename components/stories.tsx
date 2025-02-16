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
  const { toast } = useToast()

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories')
        if (!response.ok) throw new Error('Failed to fetch stories')
        
        const apiStories: APIStory[] = await response.json()
        
        // Transform API stories to component format
        const transformedStories: Story[] = [{
          id: 0,
          username: "You",
          userImage: "/placeholder-user.jpg",
          storyImage: "/placeholder.jpg",
          isViewed: false,
          duration: 15
        }, ...apiStories.map((story, index) => ({
          id: index + 1,
          username: story.username,
          userImage: story.userImage,
          storyImage: story.items[0]?.url || "/placeholder.jpg",
          isViewed: false,
          isPremium: story.tokens > 0,
          duration: story.items[0]?.duration || 10
        }))];
        
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
    
    const updateSoundLevel = () => {
      if (isPlaying && !isMuted && selectedStory) {
        setSoundLevel(Math.random() * 100)
      } else {
        setSoundLevel(0)
      }
    }

    if (selectedStory && isPlaying && !isMuted) {
      interval = setInterval(updateSoundLevel, 100)
      updateSoundLevel()
    }

    return () => clearInterval(interval)
  }, [selectedStory, isPlaying, isMuted])

  const handleStoryClick = (story: Story) => {
    if (!story) return;
    
    // Reset all states
    setProgress(0)
    setIsPlaying(true)
    setIsMuted(false)
    setSoundLevel(0)
    
    // Set selected story
    setSelectedStory(story)
    
    // Mark story as viewed after a slight delay
    setTimeout(() => {
      setStories(prev => prev.map(s => 
        s.id === story.id ? { ...s, isViewed: true } : s
      ))
    }, 100)
  }

  const handleClose = () => {
    setSelectedStory(null)
    setProgress(0)
    setIsPlaying(false)
  }

  const handleNext = () => {
    const currentIndex = stories.findIndex(s => s.id === selectedStory?.id)
    if (currentIndex < stories.length - 1) {
      handleStoryClick(stories[currentIndex + 1])
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    const currentIndex = stories.findIndex(s => s.id === selectedStory?.id)
    if (currentIndex > 0) {
      handleStoryClick(stories[currentIndex - 1])
    }
  }

  return (
    <>
      {loading && (
        <Card className="p-4 mb-4 relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 px-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0">
                <Skeleton className="w-[72px] h-[100px] rounded-xl" />
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {!loading && (
        <Card className="p-4 mb-4 relative">
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 px-1">
            {/* Create Story Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Button
                variant="outline"
                className="w-[72px] h-[100px] flex flex-col items-center justify-center gap-2 border-dashed hover:bg-accent/50 relative"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-br from-primary to-primary/50">
                    <Avatar className="w-full h-full border-2 border-background">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>YOU</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                    <Plus className="h-3 w-3" />
                  </div>
                </div>
                <span className="text-xs">Add Story</span>
              </Button>
            </motion.div>

            {/* Story Items */}
            {stories.slice(1).map((story) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
              <Button
                variant="ghost"
                className="w-[72px] h-[100px] p-0 overflow-hidden relative group rounded-xl cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStoryClick(story);
                }}
              >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url(${story.storyImage})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                  </div>
                  <div className="absolute inset-x-0 top-2 flex justify-center">
                    <div className={cn(
                      "w-16 h-16 rounded-full p-[3px]",
                      story.isViewed 
                        ? "bg-muted" 
                        : story.isPremium 
                          ? "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500" 
                          : "bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500",
                      "transition-all duration-300 ease-in-out"
                    )}>
                      <Avatar className="w-full h-full border-2 border-background">
                        <AvatarImage src={story.userImage} />
                        <AvatarFallback>{story.username[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-2 text-center">
                    <p className="text-xs text-white font-medium truncate px-1 drop-shadow-md">
                      {story.username}
                    </p>
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Story Viewer */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 bg-black/95"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                initial={{ translateY: "10%" }}
                animate={{ translateY: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full h-full max-w-md max-h-[90vh] aspect-[9/16] mx-auto"
              >
                {/* Progress Bar */}
                <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
                  {stories.map((story) => (
                    <div 
                      key={story.id}
                      className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"
                    >
                      {selectedStory.id === story.id && (
                        <motion.div
                          key={selectedStory.id}
                          className="h-full bg-white"
                          initial={{ width: "0%" }}
                          animate={isPlaying ? { width: "100%" } : {}}
                          transition={{
                            duration: selectedStory.duration ? selectedStory.duration / 1000 : 10,
                            ease: "linear"
                          }}
                          onAnimationComplete={handleNext}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Story Content */}
                <motion.div 
                  className="relative w-full h-full overflow-hidden rounded-xl"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <img
                    src={selectedStory.storyImage}
                    alt={`${selectedStory.username}'s story`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* Header */}
                <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-10 h-10 rounded-full p-[2px]",
                      selectedStory.isPremium 
                        ? "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500" 
                        : "ring-2 ring-white"
                    )}>
                      <Avatar className="w-full h-full border-2 border-background">
                        <AvatarImage src={selectedStory.userImage} />
                        <AvatarFallback>{selectedStory.username[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <span className="text-white font-medium drop-shadow-md">
                      {selectedStory.username}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full"
                    onClick={handleClose}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Controls */}
                <div className="absolute inset-0 flex">
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={handlePrevious}
                    role="button"
                    aria-label="Previous story"
                  />
                  <div 
                    className="flex-1 cursor-pointer" 
                    onClick={handleNext}
                    role="button"
                    aria-label="Next story"
                  />
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 rounded-full"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    
                    <div className="flex items-center gap-2 w-32">
                      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-white"
                          animate={{ width: `${isMuted ? 0 : soundLevel}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-full"
                        onClick={() => setIsMuted(!isMuted)}
                      >
                        {isMuted ? (
                          <VolumeX className="h-6 w-6" />
                        ) : (
                          <Volume2 className="h-6 w-6" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
