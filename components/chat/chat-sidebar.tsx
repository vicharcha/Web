"use client"

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void
  className?: string
}

const chats = [
  {
    id: '1',
    name: 'Alice',
    message: 'Hey, how are you?',
    time: '10:30 AM',
    unread: 2,
    isPremium: true
  },
  {
    id: '2',
    name: 'Bob',
    message: 'Meeting at 3?',
    time: '9:45 AM',
    unread: 0,
    isPremium: false
  },
  {
    id: '3',
    name: 'Carol',
    message: 'Thanks!',
    time: 'Yesterday',
    unread: 1,
    isPremium: true
  }
]

export function ChatSidebar({ onSelectChat, className }: ChatSidebarProps) {
  const [filter, setFilter] = useState('')

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className={cn("bg-white border-r flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Vicharcha
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full justify-start p-2 h-auto hover:bg-muted"
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{chat.name}</span>
                      {chat.isPremium && (
                        <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Premium
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{chat.message}</p>
                </div>
                {chat.unread > 0 && (
                  <Badge variant="destructive" className="rounded-full h-5 w-5 flex items-center justify-center p-0">
                    {chat.unread}
                  </Badge>
                )}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

