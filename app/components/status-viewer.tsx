"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar } from "@/components/ui/avatar"
import { X, ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { type Story } from "@/lib/types"

interface StatusViewerProps {
  stories: Story[]
  initialStoryIndex: number
  onClose: () => void
}

export function StatusViewer({ stories, initialStoryIndex, onClose }: StatusViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const currentStory = stories[currentStoryIndex]
  const isVideo = currentStory?.type === "video"
  const duration = isVideo ? undefined : 5000 // 5 seconds for images

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          handleNext()
          return 0
        }
        return prev + (100 / (duration || 5000)) * 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, currentStoryIndex])

  const handleNext = useCallback(() => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }, [currentStoryIndex, stories.length, onClose])

  const handlePrevious = useCallback(() => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1)
      setProgress(0)
    }
  }, [currentStoryIndex])

  const togglePlayback = () => {
    setIsPlaying(prev => !prev)
  }

  const toggleMute = () => {
    setIsMuted(prev => !prev)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
      onClick={onClose}
    >
      {/* Story Content */}
      <div 
        className="relative w-full h-full md:w-[400px] md:h-[80vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>

        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 ring-2 ring-white">
              <img src={currentStory.userImage} alt={currentStory.username} className="w-full h-full object-cover rounded-full" />
            </Avatar>
            <div className="flex flex-col">
              <span className="text-white font-medium text-sm">{currentStory.username}</span>
              <span className="text-white/60 text-xs">
                {new Date(currentStory.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={togglePlayback}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            {isVideo && (
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Story Media */}
        <div className="absolute inset-0">
          {isVideo ? (
            <video
              src={currentStory.media}
              className="w-full h-full object-contain"
              autoPlay
              playsInline
              loop={false}
              muted={isMuted}
              onEnded={handleNext}
            />
          ) : (
            <img
              src={currentStory.media}
              alt={`Story by ${currentStory.username}`}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="absolute inset-y-0 left-4 z-20 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handlePrevious}
            disabled={currentStoryIndex === 0}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-4 z-20 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={handleNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Views Count */}
        {currentStory.views > 0 && (
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/80">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">
                {currentStory.views.toLocaleString()} views
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
