"use client"

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

export function MainContent() {
  const [likes, setLikes] = useState<Record<number, boolean>>({})
  const [comments, setComments] = useState<Record<number, string[]>>({})
  const [newComment, setNewComment] = useState<string>('')

  const handleLike = (postId: number) => {
    setLikes(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  const handleComment = (postId: number) => {
    if (newComment.trim()) {
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment.trim()]
      }))
      setNewComment('')
    }
  }

  return (
    <ScrollArea className="flex-grow">
      <div className="px-4 py-6 space-y-6">
        <Card className="p-4 animate-in fade-in-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>VI</AvatarFallback>
                    </Avatar>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>VI</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">Vicharcha</h4>
                      <p className="text-sm text-muted-foreground">
                        Welcome to Vicharcha - your platform for meaningful discussions and connections.
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <div>
                <h3 className="font-semibold">Vicharcha</h3>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
                <DropdownMenuItem>Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm mb-4">
            Welcome to Vicharcha! Start engaging in meaningful discussions, share your thoughts, and connect with like-minded individuals.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleLike(0)}
                className={likes[0] ? "text-red-500" : ""}
              >
                <Heart className={`w-5 h-5 ${likes[0] ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
            <Button variant="ghost" size="icon">
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
          {comments[0] && comments[0].length > 0 && (
            <div className="mt-4 space-y-2">
              {comments[0].map((comment, index) => (
                <div key={index} className="bg-muted p-2 rounded-md text-sm">
                  {comment}
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <Textarea 
              placeholder="Add a comment..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none"
            />
            <Button onClick={() => handleComment(0)}>Post</Button>
          </div>
        </Card>

        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4 overflow-hidden group animate-in fade-in-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?${i}`} />
                  <AvatarFallback>U{i}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">User {i + 1}</h3>
                  <p className="text-xs text-muted-foreground">{i + 1}h ago</p>
                </div>
              </div>
              <Badge variant="secondary">New</Badge>
            </div>
            <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-muted">
              <img 
                src={`/placeholder.svg?text=Vicharcha${i + 1}`}
                alt={`Vicharcha Content ${i + 1}`}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleLike(i + 1)}
                  className={likes[i + 1] ? "text-red-500" : ""}
                >
                  <Heart className={`w-5 h-5 ${likes[i + 1] ? "fill-current" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <MessageCircle className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              <Button variant="ghost" size="icon">
                <Bookmark className="w-5 h-5" />
              </Button>
            </div>
            {comments[i + 1] && comments[i + 1].length > 0 && (
              <div className="mt-4 space-y-2">
                {comments[i + 1].map((comment, index) => (
                  <div key={index} className="bg-muted p-2 rounded-md text-sm">
                    {comment}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <Textarea 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none"
              />
              <Button onClick={() => handleComment(i + 1)}>Post</Button>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
