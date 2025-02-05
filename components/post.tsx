"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { CommentDialog } from "./comment-dialog"
import { ShareDialog } from "./share-dialog"
import { useAuth } from "@/app/components/auth-provider"

interface PostProps {
  id: string  // Changed from number to string
  username: string
  userImage: string
  content: string
  image?: string
  video?: string
  likes: number
  isPremium?: boolean
  categories: string[]
}

export function Post({
  id,
  username,
  userImage,
  content,
  image,
  video,
  likes: initialLikes,
  isPremium,
  categories,
}: PostProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [commentCount, setCommentCount] = useState(0)
  const { user } = useAuth()

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleAddComment = (comment: string) => {
    setCommentCount(commentCount + 1)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <div className="relative">
          <Avatar>
            <AvatarImage src={userImage} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          {isPremium && (
            <Badge
              variant="default"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500"
            >
              <Sparkles className="h-3 w-3" />
            </Badge>
          )}
        </div>
        <div className="flex-1">
          <div className="font-semibold">{username}</div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {image && <img src={image || "/placeholder.svg"} alt="Post" className="w-full h-auto" />}
        {video && <video src={video} className="w-full h-auto" controls />}
        <div className="p-4">
          <p>{content}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map((category) => (
              <span key={category} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                #{category}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <div className="flex justify-between w-full mb-2">
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center space-x-2">
              <AnimatePresence>
                <motion.div
                  key={isLiked ? "liked" : "unliked"}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </motion.div>
              </AnimatePresence>
              <span>{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCommentDialogOpen(true)}
              className="flex items-center space-x-2"
            >
              <MessageCircle className="h-5 w-5" />
              <span>{commentCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShareDialogOpen(true)}
              className="flex items-center space-x-2"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={handleBookmark}>
            <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardFooter>
      <CommentDialog
        isOpen={isCommentDialogOpen}
        onClose={() => setIsCommentDialogOpen(false)}
        postId={Number(id)}
        onAddComment={handleAddComment}
      />
      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        post={{ id, username, image }}
      />
    </Card>
  )
}

