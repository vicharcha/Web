"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('.interactive')) {
      return
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <Card className="relative overflow-hidden bg-black max-w-[380px] mx-auto rounded-lg">
      <CardContent className="p-0 aspect-[9/16] relative">
        {/* Video Player */}
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videoUrl}
          loop
          playsInline
          autoPlay
          muted={isMuted}
          onClick={togglePlay}
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30">
          {/* Top Controls */}
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-8 w-8"
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
          <div className="absolute right-2 bottom-20 flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12"
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
                className="text-white h-12 w-12"
              >
                <MessageCircle className="h-7 w-7" />
              </Button>
              <span className="text-white text-sm">{formatNumber(comments)}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12"
              >
                <Send className="h-7 w-7" />
              </Button>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark className={`h-7 w-7 ${isSaved ? 'fill-white' : ''}`} />
              </Button>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-white h-12 w-12"
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
              <Button variant="secondary" size="sm" className="ml-2 text-xs">
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