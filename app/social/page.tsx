"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Sparkles, Zap, TrendingUp, Users, Filter, Image, Briefcase, PenSquare } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Post } from "@/components/post"
import { Reel } from "@/components/reel"
import { ConnectionSuggestions } from "@/components/connection-suggestions"

// Story component interfaces and data
const storyVariants = {
  initial: { scale: 1 },
  animate: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const stories = [
  { id: 1, username: "frontlines", avatar: "/placeholder.svg?1", hasStory: true, isPremium: true, views: "1.2M" },
  { id: 2, username: "lohithsai", avatar: "/placeholder.svg?2", hasStory: true, isPremium: false, views: "856K" },
  { id: 3, username: "lizz_nikzz", avatar: "/placeholder.svg?3", hasStory: true, isPremium: true, views: "2.1M" },
  { id: 4, username: "olgakay", avatar: "/placeholder.svg?4", hasStory: true, isPremium: false, views: "543K" },
  { id: 5, username: "krishna_ta", avatar: "/placeholder.svg?5", hasStory: true, isPremium: true, views: "1.5M" },
  { id: 6, username: "new_story", avatar: "/placeholder.svg?6", hasStory: true, isPremium: false, views: "100K" },
];

const user = { name: "John Doe" };

interface StoryProps {
  story: {
    id: number;
    username: string;
    avatar: string;
    hasStory: boolean;
    isPremium: boolean;
    views: string;
  }
}

const Story = ({ story }: StoryProps) => (
  <motion.button
    className="flex flex-col items-center space-y-1 relative group px-1"
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
          ? "bg-premium-gradient"
          : "bg-story-gradient"
      }`}
    >
      <div className="rounded-full p-0.5 bg-background">
        <Avatar className="w-14 h-14 md:w-16 md:h-16 group-hover:scale-105 transition-transform">
          <AvatarImage src={story.avatar} alt={story.username} />
          <AvatarFallback>{story.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      {story.isPremium && (
        <div className="absolute -top-1 -right-1 bg-premium-gradient rounded-full p-1">
          <Sparkles className="h-3 w-3" />
        </div>
      )}
    </div>
    <div className="flex flex-col items-center">
      <span className="text-xs font-medium truncate max-w-[80px]">{story.username}</span>
      <span className="text-[10px] text-muted-foreground">{story.views} views</span>
    </div>
  </motion.button>
);

const StoriesSection = () => (
  <div className="relative mb-6">
    <div className="absolute inset-0 bg-gradient-to-r from-gradient-start/10 via-gradient-mid/10 to-gradient-end/10 rounded-xl blur-xl" />
    <ScrollArea className="w-full rounded-xl border bg-background/50 backdrop-blur-sm overflow-x-auto">
      <div className="flex items-center gap-2 p-4 md:gap-4">
        {/* Your Story */}
        <motion.button
          className="flex flex-col items-center space-y-1 relative group px-1"
          variants={storyVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          aria-label="Add your story"
        >
          <div className="rounded-full p-1 bg-story-gradient">
            <div className="rounded-full p-0.5 bg-background">
              <Avatar className="w-14 h-14 md:w-16 md:h-16 group-hover:scale-105 transition-transform">
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

        {/* Other Stories */}
        {stories.map((story) => (
          <Story key={story.id} story={story} />
        ))}
      </div>
    </ScrollArea>
  </div>
);

// Original interfaces
interface Post {
  id: string
  username: string
  userImage: string
  content: string
  image: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isBookmarked: boolean
  categories: string[]
  isSponsored?: boolean
}

interface Reel {
  id: string
  username: string
  userImage: string
  video: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  categories: string[]
  isSponsored?: boolean
}

const CreatePost = () => {
  const [postText, setPostText] = useState('')

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3 rounded-full border p-3">
        <Avatar className="h-8 w-8">
          <img src="/placeholder.svg" alt="Profile" className="rounded-full" />
        </Avatar>
        <input
          type="text"
          placeholder="Start a post, try writing with Vicharcha..."
          className="flex-1 bg-transparent border-none outline-none text-sm"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <Image className="h-5 w-5 mr-2" />
            Media
          </Button>
          <Button variant="ghost" size="sm">
            <Briefcase className="h-5 w-5 mr-2" />
            Job
          </Button>
          <Button variant="ghost" size="sm">
            <PenSquare className="h-5 w-5 mr-2" />
            Write article
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SocialPage() {
  const [activeMode, setActiveMode] = useState("normal")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [reels, setReels] = useState<Reel[]>([])

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

  useEffect(() => {
    setPosts([
      {
        id: "1",
        username: "techguru",
        userImage: "/placeholder.svg?1",
        content: "Just launched a new AI project! 🚀 #AI #Innovation",
        image: "/placeholder.svg?2",
        likes: 1245,
        comments: 89,
        shares: 56,
        isLiked: false,
        isBookmarked: false,
        categories: ["Technology", "Innovation"],
      },
      {
        id: "2",
        username: "travelexplorer",
        userImage: "/placeholder.svg?3",
        content: "Beautiful sunset at the beach 🌅 #Travel #Nature",
        image: "/placeholder.svg?4",
        likes: 2890,
        comments: 134,
        shares: 78,
        isLiked: true,
        isBookmarked: true,
        categories: ["Travel", "Nature"],
      },
    ])

    setReels([
      {
        id: "1",
        username: "dancepro",
        userImage: "/placeholder.svg?5",
        video: "/placeholder.mp4",
        likes: 10500,
        comments: 456,
        shares: 789,
        isLiked: false,
        categories: ["Entertainment", "Dance"],
      },
      {
        id: "2",
        username: "fitnessguru",
        userImage: "/placeholder.svg?6",
        video: "/placeholder.mp4",
        likes: 8900,
        comments: 321,
        shares: 654,
        isLiked: true,
        categories: ["Health", "Fitness"],
      },
    ])
  }, [])

  const filterContent = <T extends Post | Reel>(content: T[]): T[] => {
    if (selectedCategories.length === 0) return content
    return content.filter((item) => item.categories.some((category: string) => selectedCategories.includes(category)))
  }

  const filteredPosts = filterContent<Post>(posts)
  const filteredReels = filterContent<Reel>(reels)

  return (
    <div className="min-h-screen bg-background overflow-auto"> {/* Changed from bg-white to bg-background */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          {/* Stories Section */}
          <StoriesSection />

          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Social Feed</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeMode === "normal" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveMode("normal")}
                className="h-8"
              >
                Normal
              </Button>
              <Button
                variant={activeMode === "focus" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveMode("focus")}
                className="h-8"
              >
                <Zap className="mr-2 h-4 w-4" />
                Focus
              </Button>
              <Button
                variant={activeMode === "discovery" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveMode("discovery")}
                className="h-8"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Discovery
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allCategories.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        setSelectedCategories(
                          checked
                            ? [...selectedCategories, category]
                            : selectedCategories.filter((c) => c !== category)
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

          <Card>
            <CardContent className="p-4">
              <CreatePost />
            </CardContent>
          </Card>

          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="feed">
                Feed
              </TabsTrigger>
              <TabsTrigger value="reels">
                Reels
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="network">
                <Users className="mr-2 h-4 w-4" />
                Network
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-0">
              <ScrollArea className="h-[calc(100vh-24rem)] min-h-[400px] scrollbar-thin scrollbar-thumb-gray-400">
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredPosts
                      .filter((post) => activeMode !== "focus" || !post.isSponsored)
                      .map((post, index) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden">
                            <CardContent className="p-0">
                              <Post {...post} />
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="reels" className="mt-0">
              <ScrollArea className="scrollbar-thin scrollbar-thumb-gray-400">
                <div className="grid grid-cols-1 gap-4">
                  {filteredReels
                    .filter((reel) => activeMode !== "focus" || !reel.isSponsored)
                    .map((reel) => (
                      <Card key={reel.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <Reel {...reel} />
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="trending" className="mt-0">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Trending Topics</h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>#TechInnovation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>#SustainableLiving</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>#HealthAndWellness</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>#ArtificialIntelligence</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>#ClimateAction</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="network" className="mt-0">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Your Network</h3>
                </CardHeader>
                <CardContent>
                  <ConnectionSuggestions />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}