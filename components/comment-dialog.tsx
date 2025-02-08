"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MoreHorizontal, Send, Smile } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useAuth } from "@/app/components/auth-provider"

interface Comment {
  id: number
  username: string
  content: string
  timestamp: string
  likes: number
  isPremium?: boolean
}

interface CommentDialogProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  onAddComment?: (comment: string) => void
}

export function CommentDialog({ isOpen, onClose, postId, onAddComment }: CommentDialogProps) {
  const [newComment, setNewComment] = useState("")
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set())
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      username: "johndoe",
      content: "Great post! 👍",
      timestamp: new Date().toISOString(),
      likes: 5,
      isPremium: true,
    },
    {
      id: 2,
      username: "janedoe",
      content: "Thanks for sharing!",
      timestamp: new Date().toISOString(),
      likes: 3,
    },
  ])

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        username: user?.name || "Anonymous",
        content: newComment,
        timestamp: new Date().toISOString(),
        likes: 0,
        isPremium: user?.isPremium,
      }
      setComments([...comments, comment])
      onAddComment?.(newComment)
      setNewComment("")
    }
  }

  const toggleLike = (commentId: number) => {
    const newLiked = new Set(likedComments)
    if (newLiked.has(commentId)) {
      newLiked.delete(commentId)
    } else {
      newLiked.add(commentId)
    }
    setLikedComments(newLiked)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md h-[80vh]">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <AnimatePresence>
            {comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-3 py-4 group"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={`/placeholder.svg?text=${comment.username[0]}`} />
                  <AvatarFallback>{comment.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.username}</span>
                    {comment.isPremium && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      >
                        Premium
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.timestamp), "MMM d, yyyy")}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <button
                      onClick={() => toggleLike(comment.id)}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Heart
                        className={`h-4 w-4 ${likedComments.has(comment.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                      <span>{comment.likes + (likedComments.has(comment.id) ? 1 : 0)}</span>
                    </button>
                    <button className="hover:text-primary transition-colors">Reply</button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        <div className="flex items-center gap-2 pt-4 border-t">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleAddComment()
              }
            }}
          />
          <Button size="icon" disabled={!newComment.trim()} onClick={handleAddComment} className="shrink-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

