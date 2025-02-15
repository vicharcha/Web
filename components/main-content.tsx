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
import { useAuth } from "@/components/auth-provider"
import { ShareDialog } from "./share-dialog"
import { CommentDialog } from "./comment-dialog"
import { LikeButton } from "./like-button"
import { ContentSections } from "./content-sections"
import type { FeedPost, Post } from "@/lib/types"

export function MainContent() {
  const { user } = useAuth()
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
        username: post.userId,
        userImage: `/placeholder.svg?${post.userId}`,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        categories: [post.category],
        timestamp: new Date(post.createdAt).toLocaleString(),
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
    if (!user) return;

    try {
      await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: postId,
          userId: user.phoneNumber,
          type: 'like'
        }),
      })

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
    if (!user || !comment.trim()) return;

    try {
      await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: postId,
          userId: user.phoneNumber,
          type: 'comment',
          content: comment
        }),
      })

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
      <div className="space-y-4 md:space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-[400px] md:h-[600px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="space-y-4 md:space-y-6">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-3 -mx-2 px-2 md:-mx-4 md:px-4">
          <CreatePost />
        </div>

        <ContentSections />

        <AnimatePresence>
          {posts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "relative rounded-xl border bg-card/50 backdrop-blur-sm",
                isMobile ? "p-3" : "p-5"
              )}
            >
              <div className="flex flex-col space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <Avatar className={cn(isMobile ? "h-8 w-8" : "h-10 w-10")}>
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
                  <Button variant="ghost" size={isMobile ? "sm" : "icon"}>
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                <p className="text-sm md:text-base leading-relaxed">{post.content}</p>

                {post.mediaUrls && post.mediaUrls.length > 0 && (
                  <div className={cn(
                    "relative rounded-lg overflow-hidden",
                    isMobile ? "aspect-square" : "aspect-video"
                  )}>
                    <Image
                      src={post.mediaUrls[0]}
                      alt="Post content"
                      fill
                      className="object-cover"
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
                    className="text-sm md:text-base"
                  >
                    <MessageCircle className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                    {post.comments > 0 && post.comments}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size={isMobile ? "sm" : "default"}
                    onClick={() => setShareDialogPost(post)}
                    className="text-sm md:text-base"
                  >
                    <Share2 className="h-4 w-4 md:h-5 md:w-5 mr-1" />
                    {post.shares > 0 && post.shares}
                  </Button>
                  <Button
                    variant="ghost"
                    size={isMobile ? "sm" : "default"}
                    className="ml-auto"
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
                        "h-4 w-4 md:h-5 md:w-5",
                        post.isBookmarked && "fill-current"
                      )} 
                    />
                  </Button>
                </div>

                <div className={cn(
                  "border-t",
                  isMobile ? "pt-2" : "pt-3"
                )}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 md:h-8 md:w-8">
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
                      className="flex-1 text-sm md:text-base h-8 md:h-10"
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
