"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

const sampleStories: Story[] = [
  {
    id: 1,
    username: "You",
    userImage: "/placeholder-user.jpg",
    storyImage: "/placeholder.jpg",
    isViewed: false,
    duration: 15
  },
  {
    id: 2,
    username: "johndoe",
    userImage: "/placeholder-user.jpg",
    storyImage: "/placeholder.jpg",
    isViewed: false,
    isPremium: true,
    duration: 10
  },
  {
    id: 3,
    username: "sarahsmith",
    userImage: "/placeholder-user.jpg",
    storyImage: "/placeholder.jpg",
    isViewed: true,
    duration: 20
  },
  // Add more sample stories...
]

export function Stories() {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [soundLevel, setSoundLevel] = useState(0)

  // Simulate sound level changes
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
    setSelectedStory(story)
    setProgress(0)
    setIsPlaying(true)
  }

  const handleClose = () => {
    setSelectedStory(null)
    setProgress(0)
    setIsPlaying(false)
  }

  const handleNext = () => {
    const currentIndex = sampleStories.findIndex(s => s.id === selectedStory?.id)
    if (currentIndex < sampleStories.length - 1) {
      handleStoryClick(sampleStories[currentIndex + 1])
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    const currentIndex = sampleStories.findIndex(s => s.id === selectedStory?.id)
    if (currentIndex > 0) {
      handleStoryClick(sampleStories[currentIndex - 1])
    }
  }

  return (
    <>
      {/* Stories List */}
      <Card className="p-4 mb-4">
        <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
          {/* Create Story Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Button
              variant="outline"
              className="w-20 h-32 flex flex-col items-center justify-center gap-2 border-dashed"
            >
              <div className="relative">
                <Avatar className="w-12 h-12 border-2 border-primary">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                  <Plus className="h-3 w-3" />
                </div>
              </div>
              <span className="text-xs">Add Story</span>
            </Button>
          </motion.div>

          {/* Story Items */}
          {sampleStories.slice(1).map((story) => (
            <motion.div
              key={story.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <Button
                variant="ghost"
                className="w-20 h-32 p-0 overflow-hidden relative"
                onClick={() => handleStoryClick(story)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${story.storyImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>
                <div className="absolute inset-x-0 top-2 flex justify-center">
                  <div className={cn(
                    "ring-2 ring-offset-2",
                    story.isViewed ? "ring-muted" : "ring-primary",
                    story.isPremium && "ring-gradient-to-r from-amber-500 to-orange-500"
                  )}>
                    <Avatar className="w-10 h-10 border-2 border-background">
                      <AvatarImage src={story.userImage} />
                      <AvatarFallback>{story.username[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-2 text-center">
                  <p className="text-xs text-white font-medium truncate px-1">
                    {story.username}
                  </p>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Story Viewer */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Story Image */}
              <div className="relative w-full h-full md:w-[400px] md:h-[calc(100vh-4rem)]">
                <img
                  src={selectedStory.storyImage}
                  alt={`${selectedStory.username}'s story`}
                  className="w-full h-full object-cover"
                />

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: "0%" }}
                    animate={isPlaying ? { width: "100%" } : { width: `${progress}%` }}
                    transition={{
                      duration: selectedStory.duration || 10,
                      ease: "linear"
                    }}
                    onAnimationComplete={handleNext}
                  />
                </div>

                {/* Story Controls */}
                <div className="absolute bottom-6 left-4 right-4 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: `${soundLevel}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
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

                {/* Header */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 ring-2 ring-white">
                      <AvatarImage src={selectedStory.userImage} />
                      <AvatarFallback>{selectedStory.username[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-white font-medium">{selectedStory.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={handleClose}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation */}
                <div className="absolute inset-y-0 left-4 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
