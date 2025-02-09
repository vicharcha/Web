"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  MoreHorizontal, 
  Smile, 
  Sparkles, 
  Share2, 
  Verified,
  ChevronLeft,
  ChevronRight 
} from "lucide-react"
import Image from "next/image"
import { CreatePost } from "@/components/create-post"
import { useAuth } from "@/app/components/auth-provider"
import { ShareDialog } from "./share-dialog"
import { CommentDialog } from "./comment-dialog"
import { LikeButton } from "./like-button"

// Stories data
const stories = [
  { id: 1, username: "frontlines", avatar: "/placeholder.svg?1", hasStory: true, isPremium: true, views: "1.2M" },
  { id: 2, username: "lohithsai", avatar: "/placeholder.svg?2", hasStory: true, isPremium: false, views: "856K" },
  { id: 3, username: "lizz_nikzz", avatar: "/placeholder.svg?3", hasStory: true, isPremium: true, views: "2.1M" },
  { id: 4, username: "olgakay", avatar: "/placeholder.svg?4", hasStory: true, isPremium: false, views: "543K" },
  { id: 5, username: "krishna_ta", avatar: "/placeholder.svg?5", hasStory: true, isPremium: true, views: "1.5M" },
]

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

const storyVariants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
}

export function MainContent() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newComments, setNewComments] = useState<Record<number, string>>({})
  const { toast } = useToast()
  const [shareDialogPost, setShareDialogPost] = useState<Post | null>(null)
  const [commentDialogPost, setCommentDialogPost] = useState<Post | null>(null)
  const storiesRef = useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(true)

  const handleScroll = () => {
    if (storiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = storiesRef.current
      setShowLeftScroll(scrollLeft > 0)
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollStories = (direction: 'left' | 'right') => {
    if (storiesRef.current) {
      const scrollAmount = 200
      const newScrollLeft = storiesRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      storiesRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    const currentRef = storiesRef.current
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll)
      handleScroll() // Check initial scroll state
      return () => currentRef.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-24 rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <CreatePost />

      {/* Stories */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-violet-500/10 rounded-xl blur-xl" />
        <div className="relative rounded-xl border bg-card/50 backdrop-blur-sm">
          {/* Left Scroll Button */}
          {showLeftScroll && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 rounded-full shadow-lg"
              onClick={() => scrollStories('left')}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Right Scroll Button */}
          {showRightScroll && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 rounded-full shadow-lg"
              onClick={() => scrollStories('right')}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}

          <div 
            ref={storiesRef}
            className="flex overflow-x-auto scrollbar-hide p-4 space-x-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {/* Your Story */}
            <motion.button
              className="flex flex-col items-center space-y-1 relative group flex-shrink-0"
              variants={storyVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              aria-label="Your Story"
            >
              <div className="rounded-full p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500">
                <div className="rounded-full p-0.5 bg-background">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`/placeholder.svg?text=${user?.name?.[0] || "Y"}`} />
                    <AvatarFallback>{user?.name?.[0] || "Y"}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs font-medium">Your Story</span>
            </motion.button>

            {/* Other Stories */}
            {stories.map((story) => (
              <motion.button
                key={story.id}
                className="flex flex-col items-center space-y-1 relative group flex-shrink-0"
                variants={storyVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                aria-label={`Story by ${story.username}`}
              >
                <div className={`rounded-full p-1 ${
                  story.isPremium
                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                    : "bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500"
                }`}>
                  <div className="rounded-full p-0.5 bg-background">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  {story.isPremium && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-1">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-medium">{story.username}</span>
                  <span className="text-[10px] text-muted-foreground">{story.views} views</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

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
                aria-label={`Topic: ${topic.name}`}
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
                  <Button variant="ghost" size="icon" className="rounded-full" aria-label="More options">
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
                    loading="lazy"
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
                      aria-label="Comment"
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
