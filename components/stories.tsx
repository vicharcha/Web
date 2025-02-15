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
              className="w-20 h-32 flex flex-col items-center justify-center gap-2 border-dashed hover:bg-accent/50"
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
                className="w-20 h-32 p-0 overflow-hidden relative group"
                onClick={() => handleStoryClick(story)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${story.storyImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
                </div>
                <div className="absolute inset-x-0 top-2 flex justify-center">
                  <div className={cn(
                    "p-0.5 rounded-full",
                    story.isPremium ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-transparent",
                    story.isViewed ? "ring-2 ring-muted" : "ring-2 ring-primary"
                  )}>
                    <Avatar className="w-10 h-10 border-2 border-background">
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

      {/* Story Viewer */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full max-w-2xl max-h-[90vh] aspect-[9/16]">
                {/* Progress Bar */}
                <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
                  {sampleStories.map((story) => (
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
                <div className="relative w-full h-full overflow-hidden rounded-xl">
                  <img
                    src={selectedStory.storyImage}
                    alt={`${selectedStory.username}'s story`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Header */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-0.5 rounded-full",
                      selectedStory.isPremium ? "bg-gradient-to-r from-amber-500 to-orange-500" : "ring-2 ring-white"
                    )}>
                      <Avatar className="w-8 h-8 border-2 border-background">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}