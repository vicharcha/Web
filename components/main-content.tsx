"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Smile, Sparkles, Share2, Verified } from "lucide-react"
import Image from "next/image"
import { CreatePost } from "@/components/create-post"
import { useAuth } from "@/app/components/auth-provider"
import { ShareDialog } from "./share-dialog"
import { CommentDialog } from "./comment-dialog"
import { LikeButton } from "./like-button"

// Mock data for suggested topics
const suggestedTopics = [
  { id: 1, name: "Technology", posts: 2345 },
  { id: 2, name: "Design", posts: 1892 },
  { id: 3, name: "Development", posts: 3421 },
]

interface Post {
  id: number
  username: string
  avatar: string
  verified: boolean
  isPremium: boolean
  image: string
  caption: string
  timestamp: string
  likes: number
  views: string
  comments: Array<{
    id: number
    username: string
    content: string
    timestamp: string
    likes: number
    isPremium?: boolean
  }>
}

const postVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
}

export function MainContent() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newComments, setNewComments] = useState<Record<number, string>>({})
  const { toast } = useToast()
  const [shareDialogPost, setShareDialogPost] = useState<Post | null>(null)
  const [commentDialogPost, setCommentDialogPost] = useState<Post | null>(null)

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newPosts: Post[] = [
        {
          id: 1,
          username: "github",
          avatar: "/placeholder.svg?github",
          verified: true,
          isPremium: true,
          image: "/placeholder.svg?text=GitHub+Copilot",
          caption: "What will you build with GitHub Copilot? Link in bio. ✨",
          timestamp: "1d",
          likes: 1178,
          views: "1.2M",
          comments: [
            {
              id: 1,
              username: "mikemajdalani",
              content: "🔥 This is revolutionary!",
              timestamp: "1d",
              likes: 145,
              isPremium: true,
            },
            {
              id: 2,
              username: "techleader",
              content: "Game changer for developers 🚀",
              timestamp: "20h",
              likes: 89,
              isPremium: true,
            },
          ],
        },
      ]

      setPosts((prev) => [...prev, ...newPosts])
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load posts. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newLikes = post.likes + 1
          toast({
            description: (
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Post liked!
              </div>
            ),
          })
          return {
            ...post,
            likes: newLikes,
          }
        }
        return post
      }),
    )
  }

  const handleComment = (postId: number, comment: string) => {
    if (comment.trim()) {
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            toast({
              description: (
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Comment posted!
                </div>
              ),
            })
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: post.comments.length + 1,
                  username: user?.name || "you",
                  content: comment,
                  timestamp: "Just now",
                  likes: 0,
                  isPremium: user?.isPremium,
                },
              ],
            }
          }
          return post
        }),
      )
      setNewComments({ ...newComments, [postId]: "" })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[120px] w-full rounded-xl" />
        {[1, 2].map((i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <CreatePost />

      {/* Suggested Topics */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-violet-500/5 rounded-xl blur-xl" />
        <ScrollArea className="w-full whitespace-nowrap rounded-xl border bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 p-4">
            <Badge variant="secondary">Suggested Topics</Badge>
            {suggestedTopics.map((topic) => (
              <motion.button
                key={topic.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 rounded-full bg-primary/10 text-sm font-medium hover:bg-primary/20 transition-colors"
              >
                {topic.name}
                <span className="ml-2 text-xs text-muted-foreground">
                  {topic.posts.toLocaleString()} posts
                </span>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Posts */}
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div key={post.id} variants={postVariants} initial="hidden" animate="visible" exit="exit" layout>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-violet-500/5 rounded-xl blur-xl" />
              <div className="relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10 ring-2 ring-background">
                        <AvatarImage src={post.avatar} alt={post.username} />
                        <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {post.isPremium && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1">
                          <Sparkles className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{post.username}</span>
                      {post.verified && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                          <Verified className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <span className="text-muted-foreground">• {post.timestamp}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                {/* Post Content */}
                <p className="mb-4">{post.caption}</p>

                {/* Post Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={post.image}
                    alt={`Post by ${post.username}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <LikeButton initialLikes={post.likes} onLike={() => handleLike(post.id)} />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setCommentDialogPost(post)}
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="h-6 w-6" />
                      <span className="text-sm font-medium">{post.comments.length}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShareDialogPost(post)}
                    >
                      <Share2 className="h-6 w-6" />
                    </motion.button>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Bookmark className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Post Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm">
                  <span className="font-medium">{post.likes.toLocaleString()} likes</span>
                  <span className="text-muted-foreground">{post.views} views</span>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  {post.comments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{comment.username}</span>
                      <p className="text-sm">{comment.content}</p>
                      {comment.isPremium && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComments[post.id] || ""}
                    onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
                    className="flex-1 bg-transparent border-none focus-visible:ring-0"
                  />
                  <Button
                    variant="ghost"
                    className="text-primary font-medium"
                    disabled={!newComments[post.id]?.trim()}
                    onClick={() => handleComment(post.id, newComments[post.id] || "")}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Dialogs */}
      {shareDialogPost && (
        <ShareDialog 
          isOpen={!!shareDialogPost} 
          onClose={() => setShareDialogPost(null)} 
          post={shareDialogPost} 
        />
      )}

      {commentDialogPost && (
        <CommentDialog
          isOpen={!!commentDialogPost}
          onClose={() => setCommentDialogPost(null)}
          post={commentDialogPost}
          onAddComment={(comment) => handleComment(commentDialogPost.id, comment)}
        />
      )}
    </div>
  )
}
