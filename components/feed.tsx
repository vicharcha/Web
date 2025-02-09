"use client"

import { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Post } from './post'
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, Clock } from "lucide-react"
import { Stories } from './stories'
import { PostCategories, type FeedPost } from "@/lib/types"
import { useAuth } from "@/app/components/auth-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FeedProps {
  initialPosts?: FeedPost[];
}

const Feed: React.FC<FeedProps> = ({ initialPosts = [] }) => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts)
  const [sortBy, setSortBy] = useState<'new' | 'trending' | 'top'>('new')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const isAdultAllowed = user?.verificationStatus === 'verified'
      const queryParams = new URLSearchParams()
      if (selectedCategory !== 'all') {
        queryParams.append('category', selectedCategory)
      }
      queryParams.append('userAge', isAdultAllowed ? '18' : '0')

      const response = await fetch(`/api/posts?${queryParams.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data = await response.json()
      setPosts(data.map((post: any) => ({
        ...post,
        username: "User", // In a real app, fetch user details
        userImage: "/placeholder-user.jpg",
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        categories: [post.category], // Convert single category to array for Post component
        timestamp: post.createdAt,
        isPremium: false,
        isVerified: false
      })))
    } catch (error) {
      console.error('Error fetching posts:', error)
      // Show error state
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchPosts()
    setIsRefreshing(false)
  }

      const defaultPosts: FeedPost[] = [{
        // Base Post properties
        id: "default",
        userId: "default",
        content: "Welcome to the network!",
        category: PostCategories.GENERAL,
        ageRestricted: false,
        mediaUrls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        
        // FeedPostExtension properties
        username: "Sample User",
        userImage: "/placeholder-user.jpg",
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        isBookmarked: false,
        categories: [PostCategories.GENERAL],
        timestamp: new Date().toISOString(),
        isPremium: false,
        isVerified: false
      }]

  const displayPosts = posts.length > 0 ? posts : defaultPosts

  return (
    <div className="space-y-4">
      {/* Feed Controls */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button 
              variant={sortBy === 'new' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('new')}
              className="gap-2"
            >
              <Clock className="h-4 w-4" />
              New
            </Button>
            <Button
              variant={sortBy === 'trending' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('trending')}
              className="gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Trending
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(PostCategories).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                    {value === PostCategories.ADULT && " (18+)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className={`transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stories Section */}
      <div className="px-4">
        <Stories />
      </div>

      {/* Posts List */}
      <ScrollArea className="h-[calc(100vh-16rem)] min-h-[400px]">
        <div className="space-y-4 px-4">
          <AnimatePresence mode="popLayout">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  delay: index * 0.05 
                }}
              >
                <Post {...post} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Feed
