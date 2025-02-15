"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useResponsive } from "@/hooks/use-responsive"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"
import Image from "next/image"
import { CreatePost } from "@/components/create-post"
import { ShareDialog } from "./share-dialog"
import { CommentDialog } from "./comment-dialog"
import { LikeButton } from "./like-button"
import { ContentSections } from "./content-sections"
import { StatusSection } from "./status-section"
import type { FeedPost, Post } from "@/lib/types"

export function MainContent() {
  const user = {
    name: "Demo User",
    phoneNumber: "1234567890"
  }
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [newComments, setNewComments] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const [shareDialogPost, setShareDialogPost] = useState<FeedPost | null>(null)
  const [commentDialogPost, setCommentDialogPost] = useState<FeedPost | null>(null)
  const { isMobile } = useResponsive()

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data: Post[] = await response.json()
      const feedPosts: FeedPost[] = data.map(post => ({
        ...post,
        username: post.userId || "anonymous",
        userImage: `/placeholder.svg?${post.userId || "anon"}`,
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100),
        shares: Math.floor(Math.random() * 50),
        isLiked: false,
        isBookmarked: false,
        categories: [post.category || "general"],
        timestamp: new Date(post.createdAt || Date.now()).toLocaleString(),
        isVerified: Math.random() > 0.5,
        isPremium: Math.random() > 0.7
      }))
      
      setPosts(feedPosts)
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

  const handleLike = async (postId: string) => {
    try {
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1, isLiked: true }
          : post
      ))

      toast({
        description: (
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            Post liked!
          </div>
        ),
      })
    } catch (error) {
      console.error('Error liking post:', error)
      toast({
        variant: "destructive",
        description: "Failed to like post",
      })
    }
  }

  const handleComment = async (postId: string, comment: string) => {
    if (!comment.trim()) return;

    try {
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      ))

      setNewComments({ ...newComments, [postId]: '' })
      toast({
        description: (
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Comment posted!
          </div>
        ),
      })
    } catch (error) {
      console.error('Error posting comment:', error)
      toast({
        variant: "destructive",
        description: "Failed to post comment",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-8 md:space-y-10">
        <Skeleton className="h-20 w-full rounded-xl" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 rounded-xl border p-4 md:p-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Move status section before create post */}
        <div className="sticky top-0 z-20 -mx-4">
          <StatusSection />
          <div className="bg-background/95 backdrop-blur-md py-3 px-4">
            <CreatePost onPostCreated={fetchPosts} />
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 md:p-6 shadow-sm">
          <ContentSections />
        </div>

        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative rounded-xl border bg-card p-4 md:p-6 shadow-sm hover:shadow transition-all duration-200"
            >
              <div className="flex flex-col space-y-4 md:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className={cn(
                      "ring-2 ring-offset-2 ring-background",
                      isMobile ? "h-8 w-8" : "h-10 w-10"
                    )}>
                      <AvatarImage src={post.userImage} />
                      <AvatarFallback>{post.username[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-sm md:text-base">{post.username}</p>
                        {post.isVerified && (
                          <Verified className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-500" />
                        )}
                        {post.isPremium && (
                          <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500" />
                        )}
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {post.timestamp}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "sm" : "icon"}
                    className="hover:bg-muted/80"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                <p className="text-sm md:text-base leading-relaxed">{post.content}</p>

                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className={cn(
                    "relative rounded-lg overflow-hidden shadow-sm",
                    isMobile ? "aspect-square" : "aspect-video"
                  )}>
                    <Image
                      src={post.mediaUrls[0]}
                      alt="Post content"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2 md:space-x-4">
                  <LikeButton
                    initialLikes={post.likes}
                    isLiked={post.isLiked}
                    onLike={() => handleLike(post.id)}
                  />
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "sm" : "default"}
                    onClick={() => setCommentDialogPost(post)}
                    className="text-sm md:text-base hover:bg-muted/80"
                  >
                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                    {post.comments > 0 && post.comments}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "sm" : "default"}
                    onClick={() => setShareDialogPost(post)}
                    className="text-sm md:text-base hover:bg-muted/80"
                  >
                    <Share2 className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                    {post.shares > 0 && post.shares}
                  </Button>
                  <Button
                    variant="ghost"
                    size={isMobile ? "sm" : "default"}
                    className="ml-auto hover:bg-muted/80"
                    onClick={() => {
                      setPosts(posts.map(p => 
                        p.id === post.id 
                          ? { ...p, isBookmarked: !p.isBookmarked }
                          : p
                      ))
                    }}
                  >
                    <Bookmark 
                      className={cn(
                        "h-4 w-4 md:h-5 md:w-5 transition-transform duration-200",
                        post.isBookmarked && "fill-current scale-110"
                      )} 
                    />
                  </Button>
                </div>

                <div className={cn(
                  "border-t",
                  isMobile ? "pt-3" : "pt-4"
                )}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-6 w-6 md:h-8 md:w-8 ring-2 ring-offset-2 ring-background">
                      <AvatarImage src={`/placeholder.svg?${user?.phoneNumber}`} />
                      <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <Input
                      placeholder="Add a comment..."
                      value={newComments[post.id] || ''}
                      onChange={(e) => setNewComments({ 
                        ...newComments, 
                        [post.id]: e.target.value 
                      })}
                      className="flex-1 text-sm md:text-base h-8 md:h-10 bg-muted/50"
                    />
                    <Button 
                      size={isMobile ? "sm" : "default"}
                      disabled={!newComments[post.id]?.trim()}
                      onClick={() => handleComment(post.id, newComments[post.id] || '')}
                      className="text-sm md:text-base"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>

        {commentDialogPost && (
          <CommentDialog
            isOpen={!!commentDialogPost}
            onClose={() => setCommentDialogPost(null)}
            post={commentDialogPost}
            onAddComment={(comment) => handleComment(commentDialogPost.id, comment)}
          />
        )}

        {shareDialogPost && (
          <ShareDialog
            isOpen={!!shareDialogPost}
            onClose={() => setShareDialogPost(null)}
            post={shareDialogPost}
          />
        )}
      </div>
    </div>
  )
}
