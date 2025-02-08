"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Video, Music, X, Sparkles, Globe, Lock, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/components/auth-provider"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | null>(null)
  const [visibility, setVisibility] = useState<"public" | "private" | "connections">("public")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleMediaUpload = (type: "image" | "video" | "audio") => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : type === "video" ? "video/*" : "audio/*"
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large. Please upload a file smaller than 10MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreview(reader.result as string)
        setMediaType(file.type.split("/")[0] as "image" | "video" | "audio")
      }
      reader.readAsDataURL(file)
    }
  }

  const removeMedia = () => {
    setMediaPreview(null)
    setMediaType(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (!content.trim() && !mediaPreview) {
      toast.error("Please add some content to your post")
      return
    }

    toast.success("Post created successfully!")
    setContent("")
    setMediaPreview(null)
    setMediaType(null)
  }

  const visibilityIcons = {
    public: Globe,
    private: Lock,
    connections: Users,
  }

  const VisibilityIcon = visibilityIcons[visibility]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full bg-card">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`/placeholder.svg?text=${user?.name?.[0] || "U"}`} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              {user?.isPremium && (
                <Badge
                  variant="premium"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500"
                >
                  <Sparkles className="h-3 w-3" />
                </Badge>
              )}
            </div>
            <div className="flex-1">
              <Textarea
                placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || "there"}?`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none border-none bg-muted/50 focus-visible:ring-1"
              />
              {mediaPreview && (
                <div className="mt-4 relative">
                  {mediaType === "image" && (
                    <img
                      src={mediaPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-[300px] w-full rounded-lg object-cover"
                    />
                  )}
                  {mediaType === "video" && (
                    <video src={mediaPreview} className="max-h-[300px] w-full rounded-lg" controls />
                  )}
                  {mediaType === "audio" && <audio src={mediaPreview} className="w-full mt-2" controls />}
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeMedia}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMediaUpload("image")}
              className="rounded-full hover:bg-muted"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMediaUpload("video")}
              className="rounded-full hover:bg-muted"
            >
              <Video className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleMediaUpload("audio")}
              className="rounded-full hover:bg-muted"
            >
              <Music className="h-5 w-5" />
            </Button>
            <div className="sr-only">
              <label htmlFor="file-upload">Upload media file</label>
            </div>
            <input
              type="file"
              id="file-upload"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              title="Upload media file"
              aria-label="Upload media file"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <VisibilityIcon className="h-4 w-4" />
                  {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setVisibility("public")}>
                  <Globe className="h-4 w-4 mr-2" /> Public
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVisibility("connections")}>
                  <Users className="h-4 w-4 mr-2" /> Connections Only
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setVisibility("private")}>
                  <Lock className="h-4 w-4 mr-2" /> Private
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() && !mediaPreview}
            className="px-8 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 text-white hover:opacity-90"
          >
            Post
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
