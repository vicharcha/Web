"use client"

import { useResponsive } from "@/hooks/use-responsive"
import { cn } from "@/lib/utils"
import { MainContent } from "@/app/home/main-content"
import { PostCategories } from "@/lib/types"
import { Stories } from "@/app/stories/components/stories"
import { useML } from "@/contexts/ml-context"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const { isMobile } = useResponsive()
  const { postAnalysis, storiesAnalysis, recommendations, isLoading } = useML()

  return (
    <div className="flex-1 w-full">
      <div className="w-full mx-auto pt-4 md:pt-6">
        <div className={cn(
          "w-full mx-auto",
          isMobile ? "px-2" : "px-6 max-w-3xl"
        )}>
          {isLoading ? (
            <>
              <Skeleton className="w-full h-32 mb-4" />
              <Skeleton className="w-full h-96" />
            </>
          ) : (
            <>
              <Stories mlAnalysis={storiesAnalysis || undefined} />
              <MainContent 
                category={PostCategories.GENERAL} 
                showStories={false}
                mlAnalysis={postAnalysis || undefined}
                recommendations={recommendations || undefined}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
