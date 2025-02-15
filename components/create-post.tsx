"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { FileUpload } from "@/components/file-upload"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { Image, X, Sparkles, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PostCategories } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useSettings } from "@/hooks/use-settings"

const TOKEN_LIMIT = 500;

interface CreatePostProps {
  onPostCreated: () => Promise<void>;
  initialCategory?: string;
}

export function CreatePost({ onPostCreated, initialCategory }: CreatePostProps) {
  const { user } = useAuth()
  const { settings } = useSettings()
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [category, setCategory] = useState<string>(initialCategory || PostCategories.NEWS)
  const [mediaUrls, setMediaUrls] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleExpandClick = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to create a post",
      });
      return;
    }
    setIsExpanded(true)
    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  const handleFileSelect = (file: File) => {
    if (mediaUrls.length >= 5) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 5 files allowed",
      });
      return;
    }
    // In a real app, implement file upload to storage and get URL
    const url = `/placeholder-${Date.now()}.jpg`
    setMediaUrls([...mediaUrls, url])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to create a post",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Post content cannot be empty",
      });
      return;
    }

    if (content.length > TOKEN_LIMIT) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Content exceeds ${TOKEN_LIMIT} token limit`,
      });
      return;
    }

    setIsLoading(true);
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
          userId: user.phoneNumber,
          username: user.name || "User",
          userImage: user.image || "/placeholder-user.jpg",
          tokens: content.length,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      toast({
        title: "Success",
        description: "Post created successfully",
      });

      // Reset form
      setContent("")
      setCategory(PostCategories.GENERAL)
      setMediaUrls([])
      setIsExpanded(false)
      await onPostCreated()
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const remainingTokens = TOKEN_LIMIT - content.length;
  const isOverLimit = remainingTokens < 0;

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
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onClick={handleExpandClick}
                className={cn(
                  "min-h-[60px] bg-background/50 resize-none border-none focus-visible:ring-1",
                  isOverLimit && "border-red-500 focus-visible:ring-red-500"
                )}
                disabled={isLoading}
              />
              <span className={cn(
                "absolute bottom-2 right-2 text-xs",
                isOverLimit ? "text-red-500" : "text-muted-foreground"
              )}>
                {remainingTokens} tokens remaining
              </span>
            </div>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4 mb-4">
                    <Select 
                      value={category} 
                      onValueChange={(value: string) => setCategory(value)} 
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PostCategories.NEWS}>News</SelectItem>
                        <SelectItem value={PostCategories.ENTERTAINMENT}>Entertainment</SelectItem>
                        <SelectItem value={PostCategories.SPORTS}>Sports</SelectItem>
                        <SelectItem value={PostCategories.TECHNOLOGY}>Technology</SelectItem>
                        {settings?.isAdultContentEnabled && (
                          <SelectItem value={PostCategories.ADULT}>Adult Content (18+)</SelectItem>
                        )}
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
                              disabled={isLoading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 rounded-full"
                          disabled={isLoading || mediaUrls.length >= 5}
                        >
                          <Image className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Media (Max 5 files)</DialogTitle>
                        </DialogHeader>
                        <FileUpload 
                          onFileSelect={handleFileSelect}
                          maxSize={100}
                          allowedTypes={{ image: true, video: true }}
                        />
                      </DialogContent>
                    </Dialog>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsExpanded(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSubmit} 
                        className="gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 text-white hover:opacity-90"
                        disabled={!content.trim() || isOverLimit || isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        {isLoading ? "Posting..." : "Post"}
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
