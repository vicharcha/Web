"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, ChevronUp, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ReelPlayer } from "./reel-player"
import { useMediaQuery } from "@/hooks/use-media-query"

// Sample reels data
const reels = [
  {
    username: "johndoe",
    userImage: "/placeholder-user.jpg",
    videoUrl: "/placeholder.mp4",
    title: "Check out this amazing view! 🌅",
    description: "Beautiful sunset at the beach #sunset #vibes",
    likes: 1200,
    comments: 89,
    shares: 45
  },
  {
    username: "sarahsmith",
    userImage: "/placeholder-user.jpg",
    videoUrl: "/placeholder.mp4",
    title: "New dance challenge 💃",
    description: "Try this new dance trend! #dancechallenge",
    likes: 3500,
    comments: 245,
    shares: 123
  },
  {
    username: "+91 91828 83649",
    userImage: "/placeholder-user.jpg",
    videoUrl: "/placeholder.mp4",
    title: "Tech tutorial",
    description: "Quick tips for developers #coding #tech",
    likes: 850,
    comments: 56,
    shares: 22
  }
]

export function SidebarReels() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showNav, setShowNav] = useState(false)

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollPosition = container.scrollTop
      const itemHeight = container.clientHeight
      const newIndex = Math.round(scrollPosition / itemHeight)
      setCurrentIndex(newIndex)
      setShowNav(true)
      // Hide nav after 2 seconds of no scrolling
      setTimeout(() => setShowNav(false), 2000)
    }
  }

  const scrollToReel = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const itemHeight = container.clientHeight
      container.scrollTo({
        top: index * itemHeight,
        behavior: "smooth"
      })
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="relative h-[calc(100vh-6rem)]">
      {/* Desktop Navigation */}
      {!isMobile && (
        <AnimatePresence>
          {showNav && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2"
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => scrollToReel(currentIndex - 1)}
                disabled={currentIndex === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => scrollToReel(currentIndex + 1)}
                disabled={currentIndex === reels.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-16 left-0 right-0 z-50 flex justify-center gap-2 p-4 bg-background/80 backdrop-blur-sm border-t">
          {reels.map((_, index) => (
            <Button
              key={index}
              variant={currentIndex === index ? "default" : "outline"}
              size="icon"
              className="rounded-full h-2 w-2 p-0"
              onClick={() => scrollToReel(index)}
            />
          ))}
        </div>
      )}

      {/* Reels Container */}
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {reels.map((reel, index) => (
          <div 
            key={index}
            className="h-full snap-start snap-always"
          >
            <ReelPlayer {...reel} />
          </div>
        ))}
      </div>
    </div>
  )
}
