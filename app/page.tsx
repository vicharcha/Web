"use client"

import { useState } from "react"
import { MainContent } from "@/components/main-content"
import { NetworkConnections } from "@/components/network-connections"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flame, TrendingUp, Users } from "lucide-react"
import { motion } from "framer-motion"

// Trending topics mock data
const trendingTopics = [
  { id: 1, name: "#TechInnovation", posts: "125K" },
  { id: 2, name: "#AIFuture", posts: "89K" },
  { id: 3, name: "#DevLife", posts: "67K" },
  { id: 4, name: "#CodeCommunity", posts: "45K" },
  { id: 5, name: "#WebDev", posts: "34K" }
]

export default function Home() {
  const [activeTab, setActiveTab] = useState("feed")
  
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <Tabs defaultValue="feed" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="feed" className="gap-2">
                <Flame className="h-4 w-4" />
                For You
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="network" className="gap-2">
                <Users className="h-4 w-4" />
                Network
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-0">
              <MainContent />
            </TabsContent>

            <TabsContent value="trending" className="mt-0 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trendingTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-violet-500/10 rounded-xl blur-xl" />
                    <div className="relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
                      <h3 className="text-lg font-semibold mb-2">{topic.name}</h3>
                      <p className="text-sm text-muted-foreground">{topic.posts} posts</p>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="network" className="mt-0">
              <NetworkConnections />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-[350px] space-y-6">
          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/10 to-violet-500/10 rounded-xl blur-xl" />
            <div className="relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm">
              <h3 className="font-semibold mb-4">Your Network Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Profile Views</span>
                  <span className="font-medium">1.2K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Post Impressions</span>
                  <span className="font-medium">45.6K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Engagement Rate</span>
                  <span className="font-medium">4.8%</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Trending Topics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 to-pink-500/10 rounded-xl blur-xl" />
            <div className="relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm">
              <h3 className="font-semibold mb-4">Trending Topics</h3>
              <div className="space-y-3">
                {trendingTopics.slice(0, 3).map((topic) => (
                  <div key={topic.id} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{topic.name}</span>
                    <span className="text-xs text-muted-foreground">{topic.posts}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
