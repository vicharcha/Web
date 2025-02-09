"use client"

import { MainContent } from "@/components/main-content"

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 py-6">
        <MainContent />
      </div>
    </div>
  )
}
