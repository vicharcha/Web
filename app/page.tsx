"use client"

import { MainContent } from "@/components/main-content"
import { useResponsive } from "@/hooks/use-responsive"
import { cn } from "@/lib/utils"

export default function HomePage() {
  return (
    <main className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex relative">
          <div className="w-full md:max-w-4xl mx-auto">
            <MainContent />
          </div>
        </div>
      </div>
    </main>
  )
}
