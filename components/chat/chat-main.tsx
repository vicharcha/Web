"use client"

import { ChatHeader } from './chat-header'
import { ChatMessages } from '@/components/chat/chat-messages'
import { ChatInput } from './chat-input'
import { cn } from '@/lib/utils'

interface ChatMainProps {
  chatId: string | null
  onOpenSidebar: () => void
  className?: string
}

export function ChatMain({ chatId, onOpenSidebar, className }: ChatMainProps) {
  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message)
    // Handle message sending logic
  }

  if (!chatId) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Welcome to Vicharcha</h2>
          <p className="text-muted-foreground">Select a chat to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col bg-white", className)}>
      <ChatHeader chatId={chatId} onOpenSidebar={onOpenSidebar} />
      <ChatMessages chatId={chatId} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}
