"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea, ScrollBar } from "components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Button } from "components/ui/button"
import { Badge } from "components/ui/badge"
import { Input } from "components/ui/input"
import { Skeleton } from "components/ui/skeleton"
import { useToast } from "components/ui/use-toast"
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Smile, Sparkles, Share2, Verified } from "lucide-react"
import Image from "next/image"
import { CreatePost } from "app/components/create-post"
import { useAuth } from "app/components/auth-provider"
import { ShareDialog } from "./share-dialog"
import { CommentDialog } from "./comment-dialog"
import { LikeButton } from "./like-button"

// Enhanced stories data with premium indicators
const stories = [
  { id: 1, username: "frontlines", avatar: "/placeholder.svg?1", hasStory: true, isPremium: true, views: "1.2M" },
  { id: 2, username: "lohithsai", avatar: "/placeholder.svg?2", hasStory: true, isPremium: false, views: "856K" },
  { id: 3, username: "lizz_nikzz", avatar: "/placeholder.svg?3", hasStory: true, isPremium: true, views: "2.1M" },
  { id: 4, username: "olgakay", avatar: "/placeholder.svg?4", hasStory: true, isPremium: false, views: "543K" },
  { id: 5, username: "krishna_ta", avatar: "/placeholder.svg?5", hasStory: true, isPremium: true, views: "1.5M" },
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
            title: "Post liked!",
            description: <div className="flex items-center"><Heart className="h-4 w-4 text-red-500 mr-2" /> Post has been liked</div>
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
              title: "Comment posted!",
              description: <div className="flex items-center"><MessageCircle className="h-4 w-4 mr-2" /> Your comment has been added</div>
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
    <div className="max-w-xl mx-auto space-y-6">
      {/* Create Post */}
      <CreatePost />

      {/* Stories */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 rounded-xl blur-xl" />
        <ScrollArea className="w-full whitespace-nowrap rounded-xl border bg-card/50 backdrop-blur-sm">
          <div className="flex w-max space-x-4 p-4">
            <motion.button
              className="flex flex-col items-center space-y-1 relative group"
              variants={storyVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              aria-label="Add your story"
            >
              <div className="rounded-full p-1 bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500">
                <div className="rounded-full p-0.5 bg-background">
                  <Avatar className="w-16 h-16 group-hover:scale-105 transition-transform">
                    <AvatarImage
                      src={`/placeholder.svg?text=${user?.name?.[0] || "U"}`}
                      alt={user?.name || "Your Story"}
                    />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs font-medium">Your Story</span>
            </motion.button>

            {stories.map((story) => (
              <motion.button
                key={story.id}
                className="flex flex-col items-center space-y-1 relative group"
                variants={storyVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                aria-label={`View ${story.username}'s story`}
              >
                <div
                  className={`rounded-full p-1 ${
                    story.isPremium
                      ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"
                  }`}
                >
                  <div className="rounded-full p-0.5 bg-background">
                    <Avatar className="w-16 h-16 group-hover:scale-105 transition-transform">
                      <AvatarImage src={story.avatar} alt={story.username} />
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Posts */}
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div key={post.id} variants={postVariants} initial="hidden" animate="visible" exit="exit" layout>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-purple-500/5 to-blue-500/5 rounded-xl blur-xl" />
              <div className="border rounded-xl bg-card/50 backdrop-blur-sm relative">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
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
                    <div className="flex items-center">
                      <span className="font-semibold">{post.username}</span>
                      {post.verified && (
                        <Badge
                          variant="secondary"
                          className="ml-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        >
                          <Verified className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      <span className="text-muted-foreground ml-2">• {post.timestamp}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                {/* Post Image */}
                <div className="relative aspect-square">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={`Post by ${post.username}`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/10" />
                </div>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <LikeButton initialLikes={post.likes} onLike={() => handleLike(post.id)} />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCommentDialogPost(post)}
                        className="focus:outline-none flex items-center gap-1"
                        aria-label="View comments"
                      >
                        <MessageCircle className="h-6 w-6" />
                        <span className="text-sm font-medium">{post.comments.length}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShareDialogPost(post)}
                        className="focus:outline-none"
                        aria-label="Share post"
                      >
                        <Share2 className="h-6 w-6" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="focus:outline-none"
                      aria-label="Save post"
                    >
                      <Bookmark className="h-6 w-6" />
                    </motion.button>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="flex items-center space-x-4 mb-2 text-sm">
                    <div className="font-semibold">{post.likes.toLocaleString()} likes</div>
                    <div className="text-muted-foreground">{post.views} views</div>
                  </div>

                  {/* Caption and Comments */}
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">{post.username}</span> {post.caption}
                    </p>
                    {post.comments.length > 2 && (
                      <button className="text-muted-foreground text-sm">
                        View all {post.comments.length} comments
                      </button>
                    )}
                    {post.comments.slice(0, 2).map((comment) => (
                      <div key={comment.id} className="flex items-center space-x-2 text-sm">
                        <span className="font-semibold">{comment.username}</span>
                        <p>{comment.content}</p>
                        {comment.isPremium && (
                          <Badge
                            variant="secondary"
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground uppercase">{post.timestamp}</div>
                  </div>

                  {/* Comment Input */}
                  <div className="flex items-center mt-4 border-t pt-4">
                    <div className="flex-1 flex items-center">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Add emoji">
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComments[post.id] || ""}
                        onChange={(e) =>
                          setNewComments({
                            ...newComments,
                            [post.id]: e.target.value,
                          })
                        }
                        className="border-none bg-transparent focus-visible:ring-0"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="text-primary font-semibold"
                      disabled={!newComments[post.id]?.trim()}
                      onClick={() => handleComment(post.id, newComments[post.id] || "")}
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {shareDialogPost && (
        <ShareDialog isOpen={!!shareDialogPost} onClose={() => setShareDialogPost(null)} post={shareDialogPost} />
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
