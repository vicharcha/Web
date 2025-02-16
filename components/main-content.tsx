"use client"

import { useState, useCallback, useEffect } from "react"
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
  TrendingUp,
  Clock,
  Star,
  Users,
  Filter
} from "lucide-react"
import Image from "next/image"
import { CreatePost } from "@/components/create-post"
import { useAuth } from "@/components/auth-provider"
import { ShareDialog } from "./share-dialog"
import { CommentDialog } from "./comment-dialog"
import { LikeButton } from "./like-button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Post } from "@/lib/types"
import { useSettings } from "@/hooks/use-settings"
import { PostCategories } from '@/lib/types'
import { Stories } from "@/app/home/stories/components/stories"

type FeedPost = Post & {
  categories: string[];
  interests?: string[];
  engagementScore?: number;
  trending?: boolean;
};

interface MainContentProps {
  category: string;
  showStories?: boolean;
}

type SortOption = 'latest' | 'trending' | 'top' | 'following';
type FilterOption = 'all' | 'verified' | 'premium' | 'following' | 'interests';

export function MainContent({ category, showStories = false }: MainContentProps) {
  const { user } = useAuth()
  const { settings } = useSettings()
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [newComments, setNewComments] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const [shareDialogPost, setShareDialogPost] = useState<FeedPost | null>(null)

  const handleComment = useCallback((postId: string, comment: string) => {
    setPosts(posts => posts.map(post =>
      post.id === postId
        ? { ...post, comments: post.comments + 1 }
        : post
    ))
    setNewComments(comments => ({ ...comments, [postId]: '' }))
    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully.",
    })
  }, [toast])
  const [commentDialogPost, setCommentDialogPost] = useState<FeedPost | null>(null)
  const { isMobile } = useResponsive()
  const [sortBy, setSortBy] = useState<SortOption>('latest')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [followedUsers, setFollowedUsers] = useState<string[]>([])

  const handleLike = useCallback((postId: string) => {
    setPosts(posts => posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ))
  }, [])

  // Fetch user's interests and followed users
  useEffect(() => {
    if (user) {
      // Mock data - replace with actual API calls
      setSelectedInterests(['technology', 'sports', 'music'])
      setFollowedUsers(['user1', 'user2', 'user3'])
    }
  }, [user])

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/posts?category=${category}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data: Post[] = await response.json()
      const feedPosts: FeedPost[] = data.map(post => ({
        ...post,
        username: post.userId,
        userImage: `/placeholder.svg?${post.userId}`,
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
        isLiked: false,
        isBookmarked: false,
        categories: [post.category],
        interests: ['technology', 'sports', 'music'].slice(0, Math.floor(Math.random() * 3) + 1),
        timestamp: new Date(post.createdAt).toLocaleString(),
        isVerified: Math.random() > 0.5,
        isPremium: Math.random() > 0.7,
        engagementScore: Math.random() * 100,
        trending: Math.random() > 0.8
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
  }, [toast, category])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const getFilteredPosts = useCallback(() => {
    let filtered = [...posts];

    // Category filter
    if (category !== 'all') {
      filtered = filtered.filter(post => post.category === category);
    }

    // Adult content filter
    filtered = filtered.filter(post => {
      if (post.category === PostCategories.ADULT) {
        return settings?.isAdultContentEnabled;
      }
      return true;
    });

    // Additional filters
    switch (filterBy) {
      case 'verified':
        filtered = filtered.filter(post => post.isVerified);
        break;
      case 'premium':
        filtered = filtered.filter(post => post.isPremium);
        break;
      case 'following':
        filtered = filtered.filter(post => followedUsers.includes(post.userId));
        break;
      case 'interests':
        filtered = filtered.filter(post => 
          post.interests?.some(interest => selectedInterests.includes(interest))
        );
        break;
    }

    // Sorting
    switch (sortBy) {
      case 'trending':
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      case 'top':
        filtered.sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0));
        break;
      case 'following':
        filtered.sort((a, b) => 
          (followedUsers.includes(b.userId) ? 1 : 0) - 
          (followedUsers.includes(a.userId) ? 1 : 0)
        );
        break;
      default: // 'latest'
        filtered.sort((a, b) => 
          new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime()
        );
    }

    return filtered;
  }, [posts, category, settings?.isAdultContentEnabled, filterBy, sortBy, followedUsers, selectedInterests]);

  if (loading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-[400px] md:h-[600px] w-full rounded-xl" />
      </div>
    )
  }

  const filteredPosts = getFilteredPosts();

  return (
    <div className="w-full">
      <div className="space-y-4 md:space-y-6">
        {showStories && <Stories />}
        <CreatePost onPostCreated={fetchPosts} initialCategory={category} />
        
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Tabs value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <TabsList>
              <TabsTrigger value="latest" className="gap-2">
                <Clock className="h-4 w-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="top" className="gap-2">
                <Star className="h-4 w-4" />
                Top
              </TabsTrigger>
              <TabsTrigger value="following" className="gap-2">
                <Users className="h-4 w-4" />
                Following
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setFilterBy('all')}>
                  All Posts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy('verified')}>
                  Verified Users
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy('premium')}>
                  Premium Content
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy('following')}>
                  Following
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy('interests')}>
                  My Interests
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {selectedInterests.length > 0 && filterBy === 'interests' && (
          <div className="flex flex-wrap gap-2">
            {selectedInterests.map(interest => (
              <Badge key={interest} variant="secondary">
                {interest}
              </Badge>
            ))}
          </div>
        )}

        <AnimatePresence>
          {filteredPosts.map((post) => (
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
                      <AvatarFallback>{user?.phoneNumber?.[0]}</AvatarFallback>
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