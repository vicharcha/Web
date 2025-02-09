"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  ImageIcon, 
  Send, 
  Smile,
  Check,
  ImagePlus,
  File,
  FilePlus,
  Camera,
  Mic
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageAttachments } from "./message-attachments"
import { MessageBubble } from "./message-bubble"
import { EmojiPickerDialog } from "./emoji-picker"
import { CallDialog } from "./call-dialog"
import { ProfileInfo } from "./profile-info"
import { MediaGallery } from "./media-gallery"

interface Message {
  id: number;
  sender: "you" | "them";
  content: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  media?: {
    url: string;
    caption: string;
  };
}

interface ChatViewProps {
  chat: {
    id: string;
    name: string;
    avatar: string;
    status: string;
    isTyping?: boolean;
    isPremium?: boolean;
    isVerified?: boolean;
  };
  messages: Message[];
  onSendMessage: (message: string) => void;
  onMediaSelect?: (file: File) => void;
}

export function ChatView({ chat, messages, onSendMessage, onMediaSelect }: ChatViewProps) {
  const [messageText, setMessageText] = useState("")
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isProfileInfoOpen, setIsProfileInfoOpen] = useState(false)
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [showAttachments, setShowAttachments] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText)
      setMessageText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleMediaSelect = (file: File) => {
    if (onMediaSelect) {
      onMediaSelect(file)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="h-20 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-4">
          <div 
            className="relative group cursor-pointer" 
            onClick={() => setIsProfileInfoOpen(true)}
          >
            <Avatar className={cn(
              "h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300",
              chat.isPremium && "ring-amber-500"
            )}>
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback>{chat.name[0]}</AvatarFallback>
            </Avatar>
            <div className="opacity-0 group-hover:opacity-100 absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-background text-xs px-2 py-0.5 rounded-full border transition-opacity duration-200 whitespace-nowrap">
              View Profile
            </div>
            {chat.status === "online" && (
              <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-green-500 rounded-full ring-2 ring-background animate-pulse" />
            )}
          </div>
          <div>
            <p className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer"
               onClick={() => setIsProfileInfoOpen(true)}
            >
              {chat.name}
            </p>
            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span className="font-medium text-green-500">{chat.status}</span>
              </div>
              {chat.isTyping && (
                <motion.div 
                  className="text-xs text-muted-foreground flex items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-bounce" />
                  <span className="italic">typing...</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setIsCallDialogOpen(true)}
          >
            <Phone className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => setIsCallDialogOpen(true)}
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsMediaGalleryOpen(true)}>
                <ImageIcon className="mr-2 h-4 w-4" /> Media & Files
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" /> Search
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Block Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea 
        className="flex-1 p-6" 
        ref={scrollRef}
      >
        <div className="space-y-6">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              {...message}
              isLast={index === messages.length - 1}
              onMediaClick={() => setIsMediaGalleryOpen(true)}
              isPremium={chat.isPremium && message.sender === "them"}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Attachment Preview - Future Feature */}
        <AnimatePresence>
          {showAttachments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex gap-2 mb-4 overflow-hidden"
            >
              <Button variant="secondary" size="sm" className="rounded-full">
                <ImagePlus className="h-4 w-4 mr-2" />
                Photos & Videos
              </Button>
              <Button variant="secondary" size="sm" className="rounded-full">
                <FilePlus className="h-4 w-4 mr-2" />
                Files
              </Button>
              <Button variant="secondary" size="sm" className="rounded-full">
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full hover:bg-primary/10"
            onClick={() => setIsEmojiPickerOpen(true)}
          >
            <Smile className="h-5 w-5" />
          </Button>
          {onMediaSelect && <MessageAttachments onFileSelect={handleMediaSelect} />}
          <Input
            placeholder="Type a message..."
            className="flex-1 bg-muted/50 border-none focus-visible:ring-1 rounded-full px-4"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            size="icon"
            className={cn(
              "shrink-0 rounded-full transition-all duration-200",
              messageText.trim()
                ? "bg-primary hover:bg-primary/90 hover:scale-105"
                : "bg-muted"
            )}
            disabled={!messageText.trim()}
            onClick={handleSend}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <CallDialog isOpen={isCallDialogOpen} onClose={() => setIsCallDialogOpen(false)} />
      <ProfileInfo isOpen={isProfileInfoOpen} onClose={() => setIsProfileInfoOpen(false)} />
      <MediaGallery isOpen={isMediaGalleryOpen} onClose={() => setIsMediaGalleryOpen(false)} />
      <EmojiPickerDialog
        isOpen={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onEmojiSelect={(emoji) => setMessageText((prev) => prev + emoji)}
      />
    </div>
  )
}
