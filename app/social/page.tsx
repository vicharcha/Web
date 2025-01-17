"use client"

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, MapPin, Briefcase, Calendar, Search, Heart, MessageCircle, Share2, ImageIcon, Video, Smile } from 'lucide-react'

type Connection = {
  id: string
  name: string
  avatar: string
  isVerified: boolean
  location: string
  profession: string
  mutualConnections: number
  lastActive: string
}

const connections: Connection[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: '/placeholder.svg?1',
    isVerified: true,
    location: 'Mumbai, India',
    profession: 'Software Engineer',
    mutualConnections: 15,
    lastActive: '2 hours ago'
  },
  {
    id: '2',
    name: 'Rahul Patel',
    avatar: '/placeholder.svg?2',
    isVerified: false,
    location: 'Delhi, India',
    profession: 'Marketing Specialist',
    mutualConnections: 8,
    lastActive: '1 day ago'
  },
  {
    id: '3',
    name: 'Anita Desai',
    avatar: '/placeholder.svg?3',
    isVerified: true,
    location: 'Bangalore, India',
    profession: 'Data Scientist',
    mutualConnections: 23,
    lastActive: '3 hours ago'
  },
  // Add more connections as needed
]

interface Tweet {
  id: string
  author: {
    name: string
    avatar: string
    isVerified: boolean
    username: string
  }
  content: string
  image?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
}

const tweets: Tweet[] = [
  {
    id: '1',
    author: {
      name: 'Priya Sharma',
      avatar: '/placeholder.svg?1',
      isVerified: true,
      username: '@priyasharma'
    },
    content: 'Just launched a new project! 🚀 #coding #innovation',
    image: '/placeholder.svg?tweet1',
    likes: 245,
    comments: 23,
    shares: 12,
    timestamp: '2h ago'
  },
  {
    id: '2',
    author: {
      name: 'Rahul Patel',
      avatar: '/placeholder.svg?2',
      isVerified: false,
      username: '@rahulp'
    },
    content: 'Great meeting with the team today. Exciting things coming up! 💡',
    likes: 156,
    comments: 18,
    shares: 8,
    timestamp: '4h ago'
  },
  // Add more tweets as needed
]

export default function SocialConnectionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [newTweet, setNewTweet] = useState('')

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Tabs defaultValue="feed">
        <TabsList className="w-full">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea 
                    placeholder="What's happening?"
                    value={newTweet}
                    onChange={(e) => setNewTweet(e.target.value)}
                    className="resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Smile className="h-5 w-5" />
                      </Button>
                    </div>
                    <Button>Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {tweets.map((tweet) => (
            <Card key={tweet.id}>
              <CardContent className="pt-4">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={tweet.author.avatar} />
                    <AvatarFallback>{tweet.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{tweet.author.name}</span>
                      {tweet.author.isVerified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="text-muted-foreground">{tweet.author.username}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{tweet.timestamp}</span>
                    </div>
                    <p className="mt-2">{tweet.content}</p>
                    {tweet.image && (
                      <div className="mt-2 rounded-lg overflow-hidden">
                        <img src={tweet.image || "/placeholder.svg"} alt="Tweet content" className="w-full" />
                      </div>
                    )}
                    <div className="flex gap-6 mt-4">
                      <Button variant="ghost" size="sm" className="flex gap-2">
                        <Heart className="h-4 w-4" />
                        {tweet.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex gap-2">
                        <MessageCircle className="h-4 w-4" />
                        {tweet.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex gap-2">
                        <Share2 className="h-4 w-4" />
                        {tweet.shares}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="connections">
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredConnections.map(connection => (
                <Card key={connection.id}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={connection.avatar} alt={connection.name} />
                      <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {connection.name}
                        {connection.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                        )}
                      </CardTitle>
                      <CardDescription>{connection.profession}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {connection.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Briefcase className="h-4 w-4" />
                      {connection.mutualConnections} mutual connections
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      Last active {connection.lastActive}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Connect</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="discover">
          {/* Discover new connections content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
