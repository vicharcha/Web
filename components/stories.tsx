"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { StoryViewer } from "./story-viewer"
import type { Story } from "@/lib/types"

export function Stories() {
  const { user } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)

  useEffect(() => {
    // Fetch stories
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/stories')
        if (!response.ok) throw new Error('Failed to fetch stories')
        const data = await response.json()
        setStories(data)
      } catch (error) {
        console.error('Error fetching stories:', error)
      }
    }
    fetchStories()
  }, [])

  return (
    <Card className="p-4">
      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            className="w-20 h-32 flex flex-col items-center justify-center gap-2 border-dashed"
            onClick={() => {/* Handle create story */}}
          >
            <Avatar className="w-12 h-12 border-2 border-primary">
              <AvatarImage src={user?.image || "/placeholder-user.jpg"} />
              <AvatarFallback>
                <Plus className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs">Add Story</span>
          </Button>
        </motion.div>

        {stories.map((story) => (
          // Story preview components
          // ...rest of the stories implementation
        ))}

        {selectedStory && (
          <StoryViewer
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        )}
      </div>
    </Card>
  )
}
