"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreVertical, 
  Music2,
  Bookmark,
  Volume2,
  VolumeX
} from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface ReelPlayerProps {
  username: string
  userImage: string
  videoUrl: string
  title: string
  likes: number
  comments: number
  shares: number
  songTitle?: string
  songArtist?: string
}

export function ReelPlayer({ 
  username, 
  userImage, 
  videoUrl, 
  title, 
  likes, 
  comments, 
  shares,
  songTitle = "Original Sound",
  songArtist = username
}: ReelPlayerProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleVideoPress = (e: React.MouseEvent) => {
    // Prevent toggle if clicking on buttons or text
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('.interactive')) {
      return
    }
    togglePlay()
  }

  return (
    <Card className="relative overflow-hidden bg-black/5 backdrop-blur-lg max-w-[450px] mx-auto rounded-xl">
      <CardContent className="p-0 aspect-[9/16] relative">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover rounded-xl"
          src={videoUrl}
          loop
          playsInline
          autoPlay
          muted={isMuted}
          onClick={handleVideoPress}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40">
          {/* Top Section */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white bg-black/30 hover:bg-black/50 rounded-full h-10 w-10"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-20 flex flex-col gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={`text-white hover:bg-white/10 rounded-full h-12 w-12 p-0 ${
                isLiked ? 'scale-110' : ''
              }`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart 
                className={`h-7 w-7 transition-colors duration-200 ${
                  isLiked ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              <span className="text-xs mt-1 absolute -bottom-6">{formatNumber(likes)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full h-12 w-12 p-0"
            >
              <MessageCircle className="h-7 w-7" />
              <span className="text-xs mt-1 absolute -bottom-6">{formatNumber(comments)}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full h-12 w-12 p-0"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Bookmark className={`h-7 w-7 ${isSaved ? 'fill-white' : ''}`} />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 rounded-full h-12 w-12 p-0"
            >
              <Share2 className="h-7 w-7" />
              <span className="text-xs mt-1 absolute -bottom-6">{formatNumber(shares)}</span>
            </Button>
          </div>

          {/* Bottom Section */}
          <div className="absolute bottom-4 left-4 right-16 space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-white">
                <AvatarImage src={userImage} alt={username} />
                <AvatarFallback>{username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-white font-medium">{username}</span>
              <Button variant="secondary" size="sm" className="ml-auto">
                Follow
              </Button>
            </div>

            {/* Description */}
            <div 
              className={`text-white text-sm interactive ${!isDescExpanded ? 'line-clamp-2' : ''}`}
              onClick={() => setIsDescExpanded(!isDescExpanded)}
            >
              {title}
            </div>

            {/* Song Info */}
            <div className="flex items-center gap-2 text-white">
              <Music2 className="h-4 w-4 animate-spin" />
              <div className="text-sm font-medium">
                <span className="mr-2">{songTitle}</span>
                <span className="text-white/70">· {songArtist}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}