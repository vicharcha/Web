"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Heart, Bookmark, MoreHorizontal, Volume2, VolumeX, Send, Music2, Share2, Loader2, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { formatNumber } from "@/lib/utils"
import { ShareDialog } from "./share-dialog"
import { CommentDialog } from "./comment-dialog"
import { LikeButton } from "./like-button"

interface ReelPlayerProps {
  username: string
  userImage: string
  videoUrl: string
  title: string
  likes: number
  comments: number
  description: string
  audioTitle?: string
  audioUrl?: string
  isVerified?: boolean
}

export function ReelPlayer({ 
  username, 
  userImage, 
  videoUrl, 
  title, 
  likes, 
  comments,
  description,
  audioTitle = "Original audio",
  audioUrl,
  isVerified = false
}: ReelPlayerProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isAudioPlaying, setIsAudioPlaying] = useState(true)
  const [showAudioControls, setShowAudioControls] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showHeart, setShowHeart] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const lastTapTime = useRef(0)
  // Add these to your existing state declarations
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showCommentDialog, setShowCommentDialog] = useState(false)


  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress)
    }

    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => {
      setIsLoading(false)
      if (isPlaying) video.play()
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [isPlaying])

  const togglePlay = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('.interactive')) {
      return
    }

    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTapTime.current
    
    if (tapLength < 300) {
      handleLike()
    } else {
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
    <Card className="relative overflow-hidden bg-black w-[380px] h-[670px] mx-auto rounded-xl shadow-2xl">
      <CardContent className="p-0 aspect-[9/16] relative">
        {/* Video Player */}
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
          style={{ opacity: isLoading ? 0 : 1, filter: !isPlaying ? 'brightness(0.7)' : 'none' }}
          src={videoUrl}
          loop
          playsInline
          autoPlay
          muted={isMuted}
          onClick={togglePlay}
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 h-32" />

        {/* Loading & Play States */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </motion.div>
          )}
          {!isPlaying && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="h-20 w-20 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
                <ChevronRight className="h-10 w-10 text-white" />
              </div>
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
              <Heart className="h-32 w-32 text-red-500 fill-red-500 drop-shadow-lg" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
          >
            <ChevronLeft className="h-5 w-5 text-white" />
          </Button>

          {/* Audio Controls */}
          <div 
            className="relative"
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
            </Button>
            
            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -left-12 -bottom-24 bg-black/40 backdrop-blur-sm p-3 rounded-lg"
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value)
                      setVolume(newVolume)
                      if (videoRef.current) videoRef.current.volume = newVolume
                      setIsMuted(newVolume === 0)
                    }}
                    className="h-24 -rotate-90 accent-white/90"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
          {[
            {
              icon: <Heart className={`h-7 w-7 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />,
              label: formatNumber(likes),
              onClick: () => setIsLiked(!isLiked),
              class: isLiked ? 'animate-bounce' : ''
            },
            {
              icon: <MessageCircle className="h-7 w-7 text-white" />,
              label: formatNumber(comments)
            },
            {
              icon: <Share2 className="h-7 w-7 text-white" />
            },
            {
              icon: <Bookmark className={`h-7 w-7 ${isSaved ? 'fill-white text-white' : 'text-white'}`} />,
              onClick: () => setIsSaved(!isSaved)
            }
          ].map((action, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-12 w-12 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 ${action.class || ''}`}
                onClick={action.onClick}
              >
                {action.icon}
              </Button>
              {action.label && (
                <span className="text-white text-sm font-medium">
                  {action.label}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-16 space-y-4">
          {/* User Info */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-full p-2">
            <Avatar className="h-10 w-10 ring-2 ring-white/20">
              <AvatarImage src={userImage} alt={username} />
              <AvatarFallback>{username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{username}</span>
                {isVerified && (
                  <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white text-black hover:bg-white/90 transition-colors"
            >
              Follow
            </Button>
          </div>

          {/* Description */}
          <p className="text-white text-sm line-clamp-2 bg-black/40 backdrop-blur-sm rounded-lg p-2">
            {description}
          </p>

          {/* Audio Info */}
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm rounded-full p-2">
            <div className="h-8 w-8 bg-white/10 rounded-full flex items-center justify-center">
              <Music2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium truncate">{audioTitle}</p>
              <div className="flex gap-[2px] items-center h-4 mt-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[2px] bg-white/80"
                    animate={{
                      height: isAudioPlaying ? [4, 12, 4] : 4
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0">
          <Progress 
            value={progress} 
            className="h-1 rounded-none bg-white/20" 
          />
        </div>
      </CardContent>
    </Card>
  )
}
