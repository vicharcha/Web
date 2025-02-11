"use client"

import { MainContent } from "@/components/main-content"
import { useResponsive } from "@/hooks/use-responsive"
import { cn } from "@/lib/utils"
import { CreatePost } from "@/components/create-post"

export default function Home() {
  const { isMobile } = useResponsive()

  return (
    <div className="flex-1 w-full">
      <div className="w-full mx-auto pt-4 md:pt-6">
        <div className={cn(
          "w-full mx-auto",
          isMobile ? "px-2" : "px-6 max-w-3xl"
        )}>
          <CreatePost />
          <MainContent />
        </div>
      </div>
    </div>
  )
}
