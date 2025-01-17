"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Search
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Post {
  id: number
  author: {
    name: string
    image: string
    fallback: string
    status?: 'online' | 'offline'
  }
  content: string
  timestamp: string
  likes: number
  comments: {
    id: string
    author: string
    content: string
    timestamp: string
  }[]
  isNew?: boolean
}

export function MainContent() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        name: "User 1",
        image: "/placeholder.svg",
        fallback: "U1",
        status: 'online'
      },
      content: "Welcome to Vicharcha! Start engaging in meaningful discussions...",
      timestamp: "2h ago",
      likes: 49,
      comments: [],
      isNew: true
    },
    {
      id: 2,
      author: {
        name: "Raj Mahesh",
        image: "/placeholder.svg",
        fallback: "RM",
        status: 'online'
      },
      content: "Anna oka full stack website motham idhe develop chesthundhi anna including supabase database and strike payment gateway tho",
      timestamp: "3h ago",
      likes: 32,
      comments: []
    }
  ])
  
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [newComment, setNewComment] = useState('')

  const handleLike = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1 }
          : post
      )
    )
    setLikedPosts(prev => {
      const next = new Set(prev)
      if (next.has(postId)) {
        next.delete(postId)
      } else {
        next.add(postId)
      }
      return next
    })
  }

  return (
    <div className="flex h-full">
      {/* Main Posts Feed */}
      <div className="flex-1">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={post.author.image} alt={post.author.name} />
                        <AvatarFallback>{post.author.fallback}</AvatarFallback>
                      </Avatar>
                      {post.author.status === 'online' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">{post.author.name}</div>
                      <div className="text-xs text-muted-foreground">{post.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.isNew && <Badge>New</Badge>}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem>Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="text-sm mb-4">{post.content}</p>

                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 ${likedPosts.has(post.id) ? "text-red-500" : ""}`}
                  >
                    <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                    <span>{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Comment input */}
                <div className="mt-4">
                  <Input
                    placeholder="Add a comment..."
                    className="bg-muted"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        // Handle comment submission
                      }
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}