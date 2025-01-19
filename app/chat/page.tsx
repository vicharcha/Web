"use client"

import { useState, useEffect } from 'react'
import { ChatSidebar } from '@/components/chat-sidebar'
import ChatInterface from "@/components/chat/chat-interface"
import { Button } from '@/components/ui/button'
import { Video, Phone, MoreVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMediaQuery } from '@/hooks/use-media-query'

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    setSidebarOpen(isDesktop)
  }, [isDesktop])

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId)
    if (!isDesktop) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <AnimatePresence initial={false}>
        {(sidebarOpen || isDesktop) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-80 h-full"
          >
            <ChatSidebar onSelectChat={handleSelectChat} />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="flex items-center gap-3">
                {!isDesktop && (
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                )}
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Placeholder" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-white">Chat with {selectedChat}</h2>
                  <p className="text-sm text-white/70">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Phone className="h-5 w-5 text-white" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <Video className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
            <ChatInterface chatId={selectedChat} />
          </>
        ) : (
          <motion.div
            className="h-full flex flex-col items-center justify-center p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-semibold mb-3">Welcome to the Chat!</h3>
              <p className="text-muted-foreground mb-4">
                Select a conversation from the sidebar to start chatting.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

