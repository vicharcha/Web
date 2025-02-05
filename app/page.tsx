"use client"

import { MainContent } from "@/components/main-content"

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-6 md:py-12">
        <MainContent />
      </div>
    </div>
  )
}
