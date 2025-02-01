"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Heart, MessageCircle, Share2, Play, Sparkles, Zap, TrendingUp, Users, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Tweet({ username, content, likes, comments, shares, isSponsored, categories }) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center space-x-4 p-4">
        <Avatar>
          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={username} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{username}</div>
            {isSponsored && (
              <Badge variant="secondary" className="text-xs">
                Sponsored
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p>{content}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button variant="ghost" size="sm">
          <Heart className="mr-2 h-4 w-4" /> {likes}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageCircle className="mr-2 h-4 w-4" /> {comments}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="mr-2 h-4 w-4" /> {shares}
        </Button>
      </CardFooter>
    </Card>
  )
}

function Reel({ username, thumbnail, views, isSponsored, categories }) {
  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0 relative">
        <img
          src={thumbnail || "/placeholder.svg?height=300&width=200"}
          alt="Reel thumbnail"
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute bottom-2 left-2 flex items-center space-x-2 bg-black bg-opacity-50 p-2 rounded">
          <Play className="h-4 w-4 text-white" />
          <span className="text-sm text-white">{views} views</span>
        </div>
        {isSponsored && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Sponsored
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-2 flex flex-col items-start">
        <div className="flex items-center w-full">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={username} />
            <AvatarFallback>{username[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold">{username}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

export default function SocialPage() {
  const [activeMode, setActiveMode] = useState("normal")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const allCategories = [
    "Technology",
    "Lifestyle",
    "Health",
    "Entertainment",
    "Sports",
    "News",
    "Education",
    "Food",
    "Travel",
    "Fashion",
  ]

  const tweets = [
    {
      username: "Priya Sharma",
      content: "Just launched a new project! 🚀 #coding #innovation",
      likes: 245,
      comments: 23,
      shares: 12,
      isSponsored: false,
      categories: ["Technology", "Education"],
    },
    {
      username: "TechCorp",
      content: "Discover our latest AI-powered solutions for your business needs! 🤖💼 #AI #BusinessTech",
      likes: 189,
      comments: 45,
      shares: 78,
      isSponsored: true,
      categories: ["Technology", "News"],
    },
    {
      username: "Rahul Patel",
      content: "Great meeting with the team today. Exciting things coming up! 💡",
      likes: 156,
      comments: 18,
      shares: 8,
      isSponsored: false,
      categories: ["Lifestyle", "Education"],
    },
    {
      username: "Anita Desai",
      content: "Beautiful sunset at the beach 🌅 #nature #peace",
      likes: 302,
      comments: 31,
      shares: 15,
      isSponsored: false,
      categories: ["Travel", "Lifestyle"],
    },
  ]

  const reels = [
    {
      username: "Vikram Singh",
      thumbnail: "/placeholder.svg?height=300&width=200",
      views: "10.5K",
      isSponsored: false,
      categories: ["Sports", "Lifestyle"],
    },
    {
      username: "FitnessPro",
      thumbnail: "/placeholder.svg?height=300&width=200",
      views: "50.2K",
      isSponsored: true,
      categories: ["Health", "Lifestyle"],
    },
    {
      username: "Neha Gupta",
      thumbnail: "/placeholder.svg?height=300&width=200",
      views: "8.2K",
      isSponsored: false,
      categories: ["Fashion", "Lifestyle"],
    },
    {
      username: "Amit Kumar",
      thumbnail: "/placeholder.svg?height=300&width=200",
      views: "15.7K",
      isSponsored: false,
      categories: ["Technology", "Education"],
    },
  ]

  const filterContent = (content) => {
    if (selectedCategories.length === 0) return content
    return content.filter((item) => item.categories.some((category) => selectedCategories.includes(category)))
  }

  const filteredTweets = filterContent(tweets)
  const filteredReels = filterContent(reels)

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Social Feed</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeMode === "normal" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMode("normal")}
          >
            Normal
          </Button>
          <Button
            variant={activeMode === "focus" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMode("focus")}
          >
            <Zap className="mr-2 h-4 w-4" />
            Focus
          </Button>
          <Button
            variant={activeMode === "discovery" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMode("discovery")}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Discovery
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allCategories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    setSelectedCategories(
                      checked ? [...selectedCategories, category] : selectedCategories.filter((c) => c !== category),
                    )
                  }}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mb-6">
        <Input placeholder="What's on your mind?" className="mb-2" />
        <Button className="w-full sm:w-auto">Post</Button>
      </div>
      <Tabs defaultValue="tweets" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="tweets">Tweets</TabsTrigger>
          <TabsTrigger value="reels">Reels</TabsTrigger>
          <TabsTrigger value="trending">
            <TrendingUp className="mr-2 h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="communities">
            <Users className="mr-2 h-4 w-4" />
            Communities
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tweets">
          <ScrollArea className="h-[calc(100vh-300px)]">
            {filteredTweets
              .filter((tweet) => activeMode !== "focus" || !tweet.isSponsored)
              .map((tweet, index) => (
                <Tweet key={index} {...tweet} />
              ))}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="reels" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredReels
            .filter((reel) => activeMode !== "focus" || !reel.isSponsored)
            .map((reel, index) => (
              <Reel key={index} {...reel} />
            ))}
        </TabsContent>
        <TabsContent value="trending">
          <Card>
            <CardHeader>Trending Topics</CardHeader>
            <CardContent>
              <ul className="list-disc pl-5">
                <li>#TechInnovation</li>
                <li>#SustainableLiving</li>
                <li>#HealthAndWellness</li>
                <li>#ArtificialIntelligence</li>
                <li>#ClimateAction</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="communities">
          <Card>
            <CardHeader>Your Communities</CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Tech Enthusiasts (5.2K members)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Fitness Freaks (3.8K members)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Book Club (1.5K members)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

