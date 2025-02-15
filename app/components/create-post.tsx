"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ImageIcon, Video, Music, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/components/ui/use-toast"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<"image" | "video" | "audio" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

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
        // 10MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
        })
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
      toast({
        variant: "destructive",
        description: "Please add some content to your post",
      })
      return
    }

    // Here you would typically send the post data to your backend
    toast({
      title: "Post created!",
      description: "Your post has been shared successfully.",
    })

    // Reset form after submission
    setContent("")
    setMediaPreview(null)
    setMediaType(null)
  }

  return (
    <Card className="w-full bg-card">
      <CardContent className="pt-4">
        <div className="flex space-x-4">
          <Avatar className="w-10 h-10">
            <AvatarImage src={`/placeholder.svg?text=${user?.name?.[0] || "U"}`} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <Textarea
            placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || "there"}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow min-h-[100px] resize-none"
          />
        </div>
        {mediaPreview && (
          <div className="mt-4 relative">
            {mediaType === "image" && (
              <img
                src={mediaPreview || "/placeholder.svg"}
                alt="Preview"
                className="max-h-[300px] w-full rounded-lg object-cover"
              />
            )}
            {mediaType === "video" && <video src={mediaPreview} className="max-h-[300px] w-full rounded-lg" controls />}
            {mediaType === "audio" && <audio src={mediaPreview} className="w-full mt-2" controls />}
            <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeMedia}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={() => handleMediaUpload("image")} className="rounded-full">
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleMediaUpload("video")} className="rounded-full">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleMediaUpload("audio")} className="rounded-full">
            <Music className="h-4 w-4" />
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
        <Button onClick={handleSubmit} disabled={!content.trim() && !mediaPreview} className="px-8">
          Post
        </Button>
      </CardFooter>
    </Card>
  )
}
