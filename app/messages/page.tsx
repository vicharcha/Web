"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { ChatList } from "./components/chat-list"
import { ChatView } from "./components/chat-view"
import { Button } from "@/components/ui/button"
import { MessageSquarePlus, ArrowLeft } from "lucide-react"

// Helper function to format phone number
function formatPhoneNumber(number: string) {
  const cleaned = number.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{5})$/)
  if (match) {
    return `+${match[1]} ${match[2]} ${match[3]}`
  }
  return number
}

interface Message {
  id: number
  sender: "you" | "them"
  content: string
  time: string
  status?: "sent" | "delivered" | "read"
  media?: {
    url: string
    caption: string
  }
}

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  time: string
  unread: number
  status: string
  hasMedia: boolean
  isTyping: boolean
  isFavorite: boolean
  isPremium?: boolean
  isArchived?: boolean
  isGroup?: boolean
}

// Sample data
const chats: Chat[] = [
  {
    id: "1",
    name: formatPhoneNumber("919182883649"),
    avatar: "/placeholder-user.jpg",
    lastMessage: "Hi, how are you?",
    time: "now",
    unread: 1,
    status: "online",
    hasMedia: false,
    isTyping: true,
    isFavorite: true,
    isPremium: true,
  },
  {
    id: "2",
    name: "Project Team",
    avatar: "/placeholder-user.jpg",
    lastMessage: "Meeting at 3 PM",
    time: "10:15 am",
    unread: 3,
    status: "online",
    hasMedia: false,
    isTyping: false,
    isFavorite: true,
    isArchived: false,
    isGroup: true,
  },
]

// Sample messages
const sampleMessages: Record<string, Message[]> = {
  "1": [
    {
      id: 1,
      sender: "them",
      content: "Hi, how are you?",
      time: "10:00 AM",
      status: "read",
    },
    {
      id: 2,
      sender: "you",
      content: "I'm good, thanks for asking! How are you?",
      time: "10:01 AM",
      status: "read",
    },
    {
      id: 3,
      sender: "them",
      content: "I'm doing great! Would you like to get coffee sometime?",
      time: "10:02 AM",
      status: "delivered",
    },
  ],
  "2": [
    {
      id: 1,
      sender: "them",
      content: "Team, let's meet at 3 PM today.",
      time: "9:30 AM",
      status: "read",
    },
    {
      id: 2,
      sender: "you",
      content: "Sure, I'll be there!",
      time: "9:35 AM",
      status: "read",
    },
  ],
}

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isHalfDesktop = useMediaQuery("(min-width: 769px) and (max-width: 1200px)")

  const handleSendMessage = (message: string) => {
    console.log("Sending message:", message)
  }

  const handleMediaSelect = (file: File) => {
    console.log("Selected file:", file)
  }

  // Empty state
  const EmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
        <div className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mb-8">
          <MessageSquarePlus className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Select a chat to start messaging</h2>
        <p className="text-muted-foreground mb-8">
          Choose from your existing conversations or start a new chat with someone.
        </p>
        <Button size="lg" className="rounded-full">
          <MessageSquarePlus className="mr-2 h-5 w-5" />
          Start a New Chat
        </Button>
      </motion.div>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Chat List with Animation */}
      <AnimatePresence mode="wait">
        {(!isMobile || !selectedChat) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`overflow-hidden ${isMobile ? "w-full" : "w-[380px]"} ${isHalfDesktop ? "w-[300px]" : ""}`}
          >
            <ChatList chats={chats} selectedChat={selectedChat} onSelectChat={setSelectedChat} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat View or Empty State with Animation */}
      <AnimatePresence mode="wait">
        {(!isMobile || selectedChat) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 relative"
          >
            {selectedChat ? (
              <>
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 left-2 z-10"
                    onClick={() => setSelectedChat(null)}
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </Button>
                )}
                <ChatView
                  chat={chats.find((c) => c.id === selectedChat)!}
                  messages={sampleMessages[selectedChat] || []}
                  onSendMessage={handleSendMessage}
                  onMediaSelect={handleMediaSelect}
                />
              </>
            ) : (
              <EmptyState />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

