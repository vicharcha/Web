"use client"

import { useResponsive } from "@/hooks/use-responsive"
import { cn } from "@/lib/utils"
import { MainContent } from "@/app/home/main-content"
import { PostCategories } from "@/lib/types"
import { Stories } from "@/app/home/stories/components/stories"

export default function HomePage() {
  const { isMobile } = useResponsive()

  return (
    <div className="flex-1 w-full">
      <div className="w-full mx-auto pt-4 md:pt-6">
        <div className={cn(
          "w-full mx-auto",
          isMobile ? "px-2" : "px-6 max-w-3xl"
        )}>
          <Stories />
          <MainContent category={PostCategories.GENERAL} showStories={true} />
        </div>
      </div>
    </div>
  )
}
