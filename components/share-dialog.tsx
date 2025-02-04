"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "components/ui/dialog"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { ScrollArea } from "components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "components/ui/avatar"
import { Check, Copy, Facebook, Instagram, Twitter, PhoneIcon as WhatsApp } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface ShareDialogProps {
  isOpen: boolean
  onClose: () => void
  post: {
    id: number
    username: string
    image: string
  }
}

const socialPlatforms = [
  { name: "WhatsApp", icon: WhatsApp, color: "bg-green-500" },
  { name: "Instagram", icon: Instagram, color: "bg-pink-500" },
  { name: "Twitter", icon: Twitter, color: "bg-blue-500" },
  { name: "Facebook", icon: Facebook, color: "bg-blue-600" },
]

const suggestedUsers = [
  { id: 1, name: "Sarah Wilson", avatar: "/placeholder.svg?1", username: "sarahw" },
  { id: 2, name: "Mike Johnson", avatar: "/placeholder.svg?2", username: "mikej" },
  { id: 3, name: "Emma Davis", avatar: "/placeholder.svg?3", username: "emmad" },
  { id: 4, name: "Alex Thompson", avatar: "/placeholder.svg?4", username: "alext" },
]

export function ShareDialog({ isOpen, onClose, post }: ShareDialogProps) {
  const [copiedLink, setCopiedLink] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set())

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://vicharcha.com/p/${post.id}`)
      setCopiedLink(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      toast.error("Failed to copy link")
    }
  }

  const handleShare = () => {
    toast.success("Post shared successfully!")
    onClose()
  }

  const toggleUser = (userId: number) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>Choose how you want to share this post</DialogDescription>
        </DialogHeader>

        {/* Social Share Options */}
        <div className="grid grid-cols-4 gap-4 py-4">
          {socialPlatforms.map((platform) => (
            <motion.button
              key={platform.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2"
              onClick={() => {
                toast.success(`Sharing to ${platform.name}...`)
                onClose()
              }}
            >
              <div className={`${platform.color} p-3 rounded-full text-white`}>
                <platform.icon className="h-5 w-5" />
              </div>
              <span className="text-xs">{platform.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Copy Link */}
        <div className="flex items-center space-x-2">
          <Input value={`https://vicharcha.com/p/${post.id}`} readOnly className="flex-1" />
          <Button size="icon" variant="outline" onClick={handleCopyLink}>
            <AnimatePresence>
              {copiedLink ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Check className="h-4 w-4 text-green-500" />
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Suggested Users */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-3">Share to Users</h4>
          <ScrollArea className="h-[200px] rounded-md border p-2">
            {suggestedUsers.map((user) => (
              <motion.div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => toggleUser(user.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">@{user.username}</span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedUsers.has(user.id) ? "bg-primary border-primary" : "border-muted"
                  }`}
                >
                  {selectedUsers.has(user.id) && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={selectedUsers.size === 0}>
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

