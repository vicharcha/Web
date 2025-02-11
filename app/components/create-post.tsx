"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { FileUpload } from "@/components/file-upload"
import { motion, AnimatePresence } from "framer-motion"
import { Image, Video, Music, Smile, AtSign, Hash, MapPin, X, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PostCategories } from "@/lib/types"

export function CreatePost() {
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<string>(PostCategories.GENERAL)
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [mentions, setMentions] = useState<string[]>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  const [location, setLocation] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleExpandClick = () => {
    setIsExpanded(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  const handleFileSelect = (file: File) => {
    // In a real app, implement file upload to storage and get URL
    // For now, we'll just use a placeholder URL
    const url = `/placeholder-${Date.now()}.jpg`
    setMediaUrls([...mediaUrls, url])
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          category,
          mediaUrls,
          userId: user?.phoneNumber, // Use phoneNumber as userId
          mentions,
          hashtags,
          location
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      // Reset form
      setContent("")
      setCategory(PostCategories.GENERAL)
      setMediaUrls([])
      setMentions([])
      setHashtags([])
      setLocation("")
      setIsExpanded(false)
    } catch (error) {
      console.error('Error creating post:', error)
      // In a real app, show error toast/notification
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-violet-500/10 rounded-xl blur-xl" />
      <Card className="relative border bg-card/50 backdrop-blur-sm p-4">
        <div className="flex gap-4">
          <Avatar className="w-10 h-10 border-2 border-background">
            <AvatarImage src={`/placeholder.svg?text=${user?.name?.[0] || "U"}`} alt={user?.name} />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              ref={textareaRef}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onClick={handleExpandClick}
              className="min-h-[60px] bg-background/50 resize-none border-none focus-visible:ring-1"
            />
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4 mb-4">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(PostCategories).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                            {value === PostCategories.ADULT && " (18+)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {mediaUrls.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {mediaUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt=""
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => setMediaUrls(mediaUrls.filter((_, i) => i !== index))}
                              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {mentions.map((mention) => (
                        <div
                          key={mention}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-sm"
                        >
                          <AtSign className="h-3 w-3" />
                          {mention}
                          <button
                            onClick={() => setMentions(mentions.filter(m => m !== mention))}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {hashtags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-sm"
                        >
                          <Hash className="h-3 w-3" />
                          {tag}
                          <button
                            onClick={() => setHashtags(hashtags.filter(t => t !== tag))}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {location && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-sm">
                          <MapPin className="h-3 w-3" />
                          {location}
                          <button
                            onClick={() => setLocation("")}
                            className="hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <Image className="h-5 w-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Media</DialogTitle>
                          </DialogHeader>
                          <FileUpload 
                            onFileSelect={handleFileSelect}
                            maxSize={100}
                            allowedTypes={{ image: true, video: true }}
                          />
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <AtSign className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <Hash className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <MapPin className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                        <Smile className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsExpanded(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmit} 
                        className="gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 text-white hover:opacity-90"
                        disabled={!content.trim()}
                      >
                        <Sparkles className="h-4 w-4" />
                        Post
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
    </div>
  )
}
