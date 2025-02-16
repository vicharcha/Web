"use client"

import { useResponsive } from "@/hooks/use-responsive"
import { cn } from "@/lib/utils"
import { MainContent } from "@/components/main-content"
import { PostCategories } from "@/lib/types"
import { motion } from "framer-motion"

export default function HomePage() {
  const { isMobile } = useResponsive()

  return (
    <div className="flex-1 w-full">
      <div className="w-full mx-auto pt-4 md:pt-6">
        <div className={cn(
          "w-full mx-auto",
          isMobile ? "px-2" : "px-6 max-w-3xl"
        )}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <MainContent 
              category={PostCategories.GENERAL} 
              showStories={true} 
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
