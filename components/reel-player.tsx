"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageCircle, 
  Heart, 
  Bookmark,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Send
} from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface ReelPlayerProps {
  username: string
  userImage: string
  videoUrl: string
  title: string
  likes: number
  comments: number
  description: string
  audioTitle?: string
}

export function ReelPlayer({ 
  username, 
  userImage, 
  videoUrl, 
  title, 
  likes, 
  comments,
  description,
  audioTitle = "Original audio"
}: ReelPlayerProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showHeart, setShowHeart] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const lastTapTime = useRef(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress)
    }

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [])

  const togglePlay = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('.interactive')) {
      return
    }

    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTapTime.current
    
    if (tapLength < 300) {
      // Double tap
      handleLike()
    } else {
      // Single tap
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }
    
    lastTapTime.current = currentTime
  }

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true)
      setShowHeart(true)
      setTimeout(() => setShowHeart(false), 1000)
    }
  }

  return (
    <Card className="relative overflow-hidden bg-black max-w-[380px] mx-auto rounded-lg shadow-2xl">
      <CardContent className="p-0 aspect-[9/16] relative">
        {/* Video Player */}
        <video 
          ref={videoRef}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isLoading ? 0 : 1 }}
          src={videoUrl}
          loop
          playsInline
          autoPlay
          muted={isMuted}
          onClick={togglePlay}
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50">
          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/50"
              >
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Double Tap Heart Animation */}
          <AnimatePresence>
            {showHeart && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Heart className="h-24 w-24 text-red-500 fill-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* Top Controls */}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-8 w-8 hover:bg-white/20 transition-colors"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>

          {/* Text Overlay - Meme Style */}
          <div className="absolute top-1/3 left-0 right-0 text-center p-4">
            <h2 className="text-yellow-300 font-bold text-2xl mb-2 text-shadow-lg">
              {title}
            </h2>
            <p className="text-white text-lg font-semibold text-shadow-lg">
              {description}
            </p>
          </div>

          {/* Right Side Actions */}
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0">
            <Progress 
              value={progress} 
              className="h-1 rounded-none [&>div]:bg-gradient-to-r [&>div]:from-pink-500 [&>div]:to-violet-500 bg-white/20" 
            />
          </div>

          <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-7 w-7 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <span className="text-white text-sm">{formatNumber(likes)}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12 hover:bg-white/20 transition-all duration-200 hover:scale-110"
              >
                <MessageCircle className="h-7 w-7" />
              </Button>
              <span className="text-white text-sm">{formatNumber(comments)}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12 hover:bg-white/20 transition-all duration-200 hover:scale-110"
              >
                <Send className="h-7 w-7" />
              </Button>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12 hover:bg-white/20 transition-all duration-200 hover:scale-110"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark className={`h-7 w-7 ${isSaved ? 'fill-white' : ''}`} />
              </Button>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12 hover:bg-white/20 transition-all duration-200 hover:scale-110"
              >
                <MoreHorizontal className="h-7 w-7" />
              </Button>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-3 right-16">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8 border border-white">
                <AvatarImage src={userImage} alt={username} />
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-white font-medium">{username}</span>
              <Button 
                variant="secondary" 
                size="sm" 
                className="ml-2 text-xs bg-gradient-to-r from-pink-500 to-violet-500 text-white border-none hover:opacity-90 transition-opacity"
              >
                Follow
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">
                {audioTitle}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
