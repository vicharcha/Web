"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DarkModeCard } from "@/components/ui/dark-mode-card"
import { MoreHorizontal, MessageCircle, Repeat2, Heart, Share2, Verified } from "lucide-react"
import { motion } from "framer-motion"

interface TweetProps {
  username: string
  handle: string
  avatar: string
  content: string
  timestamp: string
  isVerified?: boolean
  metrics: {
    replies: number
    retweets: number
    likes: number
  }
  images?: string[]
}

export function Tweet({
  username,
  handle,
  avatar,
  content,
  timestamp,
  isVerified = false,
  metrics,
  images,
}: TweetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DarkModeCard 
        className="p-4 hover:bg-accent/5 transition-colors cursor-pointer"
        glowColor="from-blue-500/5 via-primary/5 to-purple-500/5"
      >
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{username}</span>
                  {isVerified && (
                    <Badge variant="secondary" className="bg-blue-500 text-white">
                      <Verified className="h-3 w-3" />
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground">@{handle}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{timestamp}</span>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm">{content}</p>
            {images && images.length > 0 && (
              <div className={`grid gap-2 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="Tweet attachment"
                    className="rounded-lg w-full object-cover"
                    style={{ aspectRatio: "16/9" }}
                  />
                ))}
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500 gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{metrics.replies}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500 gap-2">
                <Repeat2 className="h-4 w-4" />
                <span className="text-sm">{metrics.retweets}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 gap-2">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{metrics.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DarkModeCard>
    </motion.div>
  )
}
