"use client"

import { useEffect, useRef, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from '@/lib/utils'

type MessageType = {
  id: string
  content: string
  sender: 'user' | 'other'
  timestamp: string
}

interface ChatMessagesProps {
  chatId: string
}

export function ChatMessages({ chatId }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const messages = useMemo<MessageType[]>(() => [
    {
      id: '1',
      content: `Hello! Welcome to chat ${chatId}`,
      sender: 'other',
      timestamp: '10:00 AM'
    },
    {
      id: '2',
      content: 'I have a question about the new feature.',
      sender: 'user',
      timestamp: '10:05 AM'
    }
  ], [chatId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-start gap-2.5",
              message.sender === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {message.sender === 'user' ? 'U' : 'O'}
              </AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "rounded-lg px-4 py-2 max-w-[80%] break-words",
                message.sender === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-muted rounded-tl-none"
              )}
            >
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

