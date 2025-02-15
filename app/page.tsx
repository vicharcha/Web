"use client"

import Feed from "@/components/feed"
import { useResponsive } from "@/hooks/use-responsive"
import { cn } from "@/lib/utils"
import { StatusBar } from "@/components/status-bar"
import { CreatePost } from "@/components/create-post"

export default function HomePage() {
  return (
    <main className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex relative">
          <div className="w-full md:max-w-4xl mx-auto">
            <StatusBar />
            <CreatePost />
            <Feed />
          </div>
        </div>
      </div>
    </main>
  )
}
