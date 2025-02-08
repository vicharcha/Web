"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Sparkles, Zap, Users, Briefcase, Building2, MapPin, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { ConnectionSuggestions } from "@/components/connection-suggestions"
import { JobFilters } from "@/components/job-filters"
import { ReelPlayer } from "@/components/reel-player"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  postedDate: string
  description: string
  requirements: string[]
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

const JobPost = ({ job }: { job: Job }) => (
  <Card className="mb-4">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{job.title}</h3>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span>{job.company}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{job.postedDate}</span>
          </div>
        </div>
        <Button variant="outline">Apply Now</Button>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{job.description}</p>
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {job.requirements.map((req, index) => (
            <span key={index} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
              {req}
            </span>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)

const CreateJobPost = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-3 rounded-full border p-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" alt="Profile" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <input
          type="text"
          placeholder="Post a job opportunity..."
          className="flex-1 bg-transparent border-none outline-none text-sm"
        />
      </div>
      <Button className="w-full">
        <Briefcase className="mr-2 h-4 w-4" />
        Create Job Post
      </Button>
    </div>
  )
}

export default function SocialPage() {
  const [activeMode, setActiveMode] = useState("normal")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [reels, setReels] = useState<Reel[]>([])
  const [jobs, setJobs] = useState<Job[]>([])

  const allCategories = [
    "Technology",
    "Marketing",
    "Design",
    "Sales",
    "Engineering",
    "Finance",
    "Healthcare",
    "Education",
  ]

  useEffect(() => {
    setReels([
      {
        id: "1",
        username: "techrecruiter",
        userImage: "/placeholder.svg?5",
        video: "/placeholder.mp4",
        likes: 10500,
        comments: 456,
        shares: 789,
        isLiked: false,
        categories: ["Technology", "Careers"],
      },
      {
        id: "2",
        username: "careercoach",
        userImage: "/placeholder.svg?6",
        video: "/placeholder.mp4",
        likes: 8900,
        comments: 321,
        shares: 654,
        isLiked: true,
        categories: ["Career Development", "Professional Growth"],
      },
    ])

    setJobs([
      {
        id: "1",
        title: "Senior Software Engineer",
        company: "TechCorp",
        location: "Remote",
        type: "Full-time",
        postedDate: "2 days ago",
        description: "We're looking for an experienced software engineer to join our team...",
        requirements: ["React", "Node.js", "5+ years experience", "Cloud platforms"],
      },
      {
        id: "2",
        title: "Product Designer",
        company: "DesignHub",
        location: "New York, NY",
        type: "Full-time",
        postedDate: "1 day ago",
        description: "Join our design team to create beautiful and functional products...",
        requirements: ["Figma", "UI/UX", "3+ years experience", "Design systems"],
      },
    ])
  }, [])

  const filterContent = <T extends Reel | Job>(content: T[]): T[] => {
    if (selectedCategories.length === 0) return content
    if ("categories" in content[0]) {
      return content.filter((item) =>
        (item as Reel).categories.some((category) => selectedCategories.includes(category)),
      )
    }
    return content
  }

  const filteredReels = filterContent<Reel>(reels)
  const filteredJobs = filterContent<Job>(jobs)

  return (
    <div className="min-h-screen bg-background overflow-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Professional Network</h1>
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
            </div>
          </div>

          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="jobs">
                <Briefcase className="mr-2 h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="reels">Reels</TabsTrigger>
              <TabsTrigger value="network">
                <Users className="mr-2 h-4 w-4" />
                Network
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="mt-0">
              <Card className="mb-4">
                <CardContent className="p-4">
                  <CreateJobPost />
                </CardContent>
              </Card>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Job Listings</h2>
                <JobFilters />
              </div>
              <ScrollArea className="h-[calc(100vh-24rem)] min-h-[400px]">
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredJobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <JobPost job={job} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="reels" className="mt-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="max-w-sm mx-auto space-y-4">
                  {filteredReels
                    .filter((reel) => activeMode !== "focus" || !reel.isSponsored)
                    .map((reel) => (
                      <ReelPlayer
                        key={reel.id}
                        username={reel.username}
                        userImage={reel.userImage}
                        videoUrl={reel.video}
                        title="Check out this amazing content! #trending"
                        likes={reel.likes}
                        comments={reel.comments}
                        shares={reel.shares}
                      />
                    ))}
                </div>
              </ScrollArea>
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
<<<<<<< HEAD

=======
>>>>>>> 4e2df3b363aa00d9dfae7022c21ff6a2963fcc29
