"use client"

import { StatusBar } from "./components/status-bar"
import { Post } from "./components/post"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { getHomeData } from "../lib/services/home-service"
import { useEffect, useState } from "react"
import { HomeData } from "../lib/services/home-service"

export default function Home() {
  const [posts, setPosts] = useState<HomeData[]>([])

  useEffect(() => {
    async function fetchData() {
      const data = await getHomeData()
      setPosts(data)
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home</h1>
        <Button size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> New Post
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <StatusBar />
      </ScrollArea>
      {posts.map((post, index) => (
        <Post key={index} {...post} />
      ))}
    </div>
  )
}
