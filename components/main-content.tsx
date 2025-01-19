'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from 'lucide-react'
import Image from 'next/image'

// Sample stories data
const stories = [
  { id: 1, username: 'frontlines', avatar: '/placeholder.svg?1', hasStory: true },
  { id: 2, username: 'lohithsai', avatar: '/placeholder.svg?2', hasStory: true },
  { id: 3, username: 'lizz_nikzz', avatar: '/placeholder.svg?3', hasStory: true },
  { id: 4, username: 'olgakay', avatar: '/placeholder.svg?4', hasStory: true },
  { id: 5, username: 'krishna_ta', avatar: '/placeholder.svg?5', hasStory: true },
  { id: 6, username: 'mizzlesupreme', avatar: '/placeholder.svg?6', hasStory: true },
  { id: 7, username: 'speedymo', avatar: '/placeholder.svg?7', hasStory: true },
  { id: 8, username: 'luvvie', avatar: '/placeholder.svg?8', hasStory: true },
]

interface Post {
  id: number
  username: string
  avatar: string
  verified: boolean
  image: string
  caption: string
  timestamp: string
  likes: number
  comments: Array<{
    id: number
    username: string
    content: string
    timestamp: string
    likes: number
  }>
}

const postVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2 }
  }
}

export function MainContent() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newComments, setNewComments] = useState<Record<number, string>>({})
  const { toast } = useToast()

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newPosts: Post[] = [{
        id: 1,
        username: 'github',
        avatar: '/placeholder.svg?github',
        verified: true,
        image: '/placeholder.svg?text=GitHub+Copilot',
        caption: 'What will you build with GitHub Copilot? Link in bio.',
        timestamp: '1d',
        likes: 1178,
        comments: [
          {
            id: 1,
            username: 'mikemajdalani',
            content: '🔥 🔥',
            timestamp: '1d',
            likes: 1
          },
          {
            id: 2,
            username: 'ankushsharma',
            content: "It isn't that much smooth 😕",
            timestamp: '20h',
            likes: 1
          }
        ]
      }]

      setPosts(prev => [...prev, ...newPosts])
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load posts. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLikes = post.likes + 1
        toast({
          description: "Post liked!"
        })
        return {
          ...post,
          likes: newLikes
        }
      }
      return post
    }))
  }

  const handleComment = (postId: number) => {
    if (newComments[postId]?.trim()) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          toast({
            description: "Comment posted!"
          })
          return {
            ...post,
            comments: [...post.comments, {
              id: post.comments.length + 1,
              username: 'you',
              content: newComments[postId],
              timestamp: 'Just now',
              likes: 0
            }]
          }
        }
        return post
      }))
      setNewComments({ ...newComments, [postId]: '' })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Stories */}
      <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-card">
        <div className="flex w-max space-x-4 p-4">
          {stories.map((story) => (
            <button 
              key={story.id} 
              className="flex flex-col items-center space-y-1"
              aria-label={`View ${story.username}'s story`}
            >
              <div className={`rounded-full p-1 ${story.hasStory ? 'bg-gradient-to-tr from-yellow-400 to-fuchsia-600' : 'bg-muted'}`}>
                <div className="rounded-full p-0.5 bg-background">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={story.avatar} alt={story.username} />
                    <AvatarFallback>{story.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs">{story.username}</span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Posts */}
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            variants={postVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <div className="border rounded-lg bg-card">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={post.avatar} alt={post.username} />
                    <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center">
                    <span className="font-semibold">{post.username}</span>
                    {post.verified && (
                      <Badge variant="secondary" className="ml-1">
                        <span className="text-blue-500">✓</span>
                      </Badge>
                    )}
                    <span className="text-muted-foreground ml-2">• {post.timestamp}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
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
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => handleLike(post.id)}
                      className="focus:outline-none"
                      aria-label={`Like post by ${post.username}`}
                      title="Like post"
                    >
                      <Heart className="h-6 w-6" />
                    </motion.button>
                    <button 
                      className="focus:outline-none"
                      aria-label="Comment on post"
                      title="Add comment"
                    >
                      <MessageCircle className="h-6 w-6" />
                    </button>
                    <button 
                      className="focus:outline-none"
                      aria-label="Share post"
                      title="Share post"
                    >
                      <Send className="h-6 w-6" />
                    </button>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    className="focus:outline-none"
                    aria-label="Save post"
                    title="Save post"
                  >
                    <Bookmark className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* Likes */}
                <div className="font-semibold mb-2">{post.likes.toLocaleString()} likes</div>

                {/* Caption and Comments */}
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">{post.username}</span>{' '}
                    {post.caption}
                  </p>
                  {post.comments.length > 2 && (
                    <button className="text-muted-foreground text-sm">
                      View all {post.comments.length} comments
                    </button>
                  )}
                  {post.comments.slice(0, 2).map((comment) => (
                    <div key={comment.id} className="text-sm">
                      <span className="font-semibold">{comment.username}</span>{' '}
                      {comment.content}
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground uppercase">
                    {post.timestamp}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="flex items-center mt-4 border-t pt-4">
                  <div className="flex-1 flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9"
                      aria-label="Add emoji"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Input 
                      type="text" 
                      placeholder="Add a comment..." 
                      value={newComments[post.id] || ''}
                      onChange={(e) => setNewComments({
                        ...newComments,
                        [post.id]: e.target.value
                      })}
                      className="border-none bg-transparent focus-visible:ring-0"
                    />
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-blue-500 font-semibold"
                    disabled={!newComments[post.id]?.trim()}
                    onClick={() => handleComment(post.id)}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

