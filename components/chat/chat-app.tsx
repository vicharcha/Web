"use client"

import { useState } from 'react'
import { ChatSidebar } from './chat-sidebar'
import { ChatMain } from './chat-main'
import { useMediaQuery } from '@/hooks/use-media-query'

export function ChatApp() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {(sidebarOpen || !isMobile) && (
        <ChatSidebar 
          onSelectChat={handleSelectChat}
          className={isMobile ? "w-full absolute inset-0 z-30" : "w-80"}
        />
      )}
      <ChatMain
        chatId={selectedChat}
        onOpenSidebar={() => setSidebarOpen(true)}
        className={isMobile && sidebarOpen ? "hidden" : "flex-1"}
      />
    </div>
  )
}

