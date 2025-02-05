"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Video {
  id: string
  title: string
  thumbnail: string
  url: string
}

export function YouTubeVideosSection() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVideos = async () => {
    try {
      // Simulate fetching videos from an API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newVideos = [
        { id: "1", title: "Video 1", thumbnail: "https://via.placeholder.com/150", url: "https://www.youtube.com/watch?v=1" },
        { id: "2", title: "Video 2", thumbnail: "https://via.placeholder.com/150", url: "https://www.youtube.com/watch?v=2" },
        { id: "3", title: "Video 3", thumbnail: "https://via.placeholder.com/150", url: "https://www.youtube.com/watch?v=3" },
      ]

      setVideos(newVideos)
    } catch (error) {
      console.error("Error fetching videos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">YouTube Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{video.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                <img src={video.thumbnail} alt={video.title} className="w-full h-auto" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
