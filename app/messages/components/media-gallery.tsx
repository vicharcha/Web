"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Image as ImageIcon, FileText, Music, Video } from "lucide-react"
import Image from "next/image" // Added for proper image component

interface MediaGalleryProps {
  isOpen: boolean
  onClose: () => void
}

// Define types for media items
interface BaseMediaItem {
  type: "image" | "video" | "document" | "audio"
  date: string
}

interface ImageMediaItem extends BaseMediaItem {
  type: "image"
  src: string
}

interface VideoMediaItem extends BaseMediaItem {
  type: "video"
  src: string
}

interface DocumentMediaItem extends BaseMediaItem {
  type: "document"
  name: string
}

interface AudioMediaItem extends BaseMediaItem {
  type: "audio"
  name: string
}

type MediaItem = ImageMediaItem | VideoMediaItem | DocumentMediaItem | AudioMediaItem

// Props interface for MediaItem component
interface MediaItemProps {
  item: MediaItem
}

export function MediaGallery({ isOpen, onClose }: MediaGalleryProps) {
  const mediaItems: MediaItem[] = [
    { type: "image", src: "/placeholder.svg?1", date: "2023-05-15" },
    { type: "image", src: "/placeholder.svg?2", date: "2023-05-14" },
    { type: "video", src: "/placeholder.mp4", date: "2023-05-13" },
    { type: "document", name: "report.pdf", date: "2023-05-12" },
    { type: "audio", name: "voice-message.mp3", date: "2023-05-11" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Media & Files</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
          </TabsList>
          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="all" className="grid grid-cols-3 gap-4">
              {mediaItems.map((item, index) => (
                <MediaItem key={index} item={item} />
              ))}
            </TabsContent>
            <TabsContent value="images" className="grid grid-cols-3 gap-4">
              {mediaItems
                .filter((item): item is ImageMediaItem => item.type === "image")
                .map((item, index) => (
                  <MediaItem key={index} item={item} />
                ))}
            </TabsContent>
            <TabsContent value="videos" className="grid grid-cols-3 gap-4">
              {mediaItems
                .filter((item): item is VideoMediaItem => item.type === "video")
                .map((item, index) => (
                  <MediaItem key={index} item={item} />
                ))}
            </TabsContent>
            <TabsContent value="documents" className="grid grid-cols-3 gap-4">
              {mediaItems
                .filter((item): item is DocumentMediaItem => item.type === "document")
                .map((item, index) => (
                  <MediaItem key={index} item={item} />
                ))}
            </TabsContent>
            <TabsContent value="audio" className="grid grid-cols-3 gap-4">
              {mediaItems
                .filter((item): item is AudioMediaItem => item.type === "audio")
                .map((item, index) => (
                  <MediaItem key={index} item={item} />
                ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function MediaItem({ item }: MediaItemProps) {
  switch (item.type) {
    case "image":
      return (
        <div className="relative aspect-square">
          <Image 
            src={item.src || "/placeholder.svg"} 
            alt="Media item" 
            className="object-cover rounded-md" 
            fill
          />
        </div>
      )
    case "video":
      return (
        <div className="relative aspect-video bg-muted rounded-md flex items-center justify-center">
          <Video className="h-8 w-8" strokeWidth={1.5} />
        </div>
      )
    case "document":
      return (
        <div className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center p-4">
          <FileText className="h-8 w-8 mb-2" strokeWidth={1.5} />
          <span className="text-xs text-muted-foreground text-center break-all">
            {item.name}
          </span>
        </div>
      )
    case "audio":
      return (
        <div className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center p-4">
          <Music className="h-8 w-8 mb-2" strokeWidth={1.5} />
          <span className="text-xs text-muted-foreground text-center break-all">
            {item.name}
          </span>
        </div>
      )
    default:
      return null
  }
}