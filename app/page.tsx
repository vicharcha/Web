"use client"

import { MainContent } from "@/components/main-content"
import { useResponsive } from "@/hooks/use-responsive"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Newspaper, Film, Trophy, Cpu } from "lucide-react"
import { PostCategories } from "@/lib/types"

export default function HomePage() {
  const { isMobile } = useResponsive()

  return (
    <div className="flex-1 w-full">
      <div className="w-full mx-auto pt-4 md:pt-6">
        <div className={cn(
          "w-full mx-auto",
          isMobile ? "px-2" : "px-6 max-w-3xl"
        )}>
          <Tabs defaultValue={PostCategories.GENERAL} className="mb-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value={PostCategories.GENERAL} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                For You
              </TabsTrigger>
              <TabsTrigger value={PostCategories.NEWS} className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                News
              </TabsTrigger>
              <TabsTrigger value={PostCategories.ENTERTAINMENT} className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                Entertainment
              </TabsTrigger>
              <TabsTrigger value={PostCategories.SPORTS} className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Sports
              </TabsTrigger>
              <TabsTrigger value={PostCategories.TECHNOLOGY} className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Technology
              </TabsTrigger>
            </TabsList>

            {Object.values(PostCategories).map((category) => (
              category !== PostCategories.ADULT && (
                <TabsContent key={category} value={category}>
                  <MainContent category={category} showStories={category === PostCategories.GENERAL} />
                </TabsContent>
              )
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
