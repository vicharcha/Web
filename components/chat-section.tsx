"use client"

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type ChatUser = {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: number
  isVerified: boolean
  isPremium: boolean
  avatar?: string
}

const chats: ChatUser[] = [
  { 
    id: '1', 
    name: 'Alice', 
    lastMessage: 'Hey, how are you?', 
    time: '10:30 AM', 
    unread: 2,
    isVerified: true,
    isPremium: true,
    avatar: '/placeholder.svg'
  },
  { 
    id: '2', 
    name: 'Bob', 
    lastMessage: 'Meeting at 3?', 
    time: '9:45 AM', 
    unread: 0,
    isVerified: false,
    isPremium: false,
    avatar: '/placeholder.svg'
  },
  { 
    id: '3', 
    name: 'Carol', 
    lastMessage: 'Thanks!', 
    time: 'Yesterday', 
    unread: 1,
    isVerified: true,
    isPremium: true,
    avatar: '/placeholder.svg'
  }
]

interface ChatSectionProps {
  onSelectChat?: (chatId: string) => void
}

export function ChatSection({ onSelectChat }: ChatSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOptions, setFilterOptions] = useState({
    onlyUnread: false,
    onlyVerified: false,
    sortBy: 'recent' as 'recent' | 'unread' | 'alphabetical'
  })

  const filteredChats = chats
    .filter(chat => {
      if (filterOptions.onlyUnread && chat.unread === 0) return false
      if (filterOptions.onlyVerified && !chat.isVerified) return false
      if (searchQuery && !chat.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (filterOptions.sortBy) {
        case 'unread':
          return b.unread - a.unread
        case 'alphabetical':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  return (
    <div className="w-full md:w-80 h-full border-r flex flex-col bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl">
      <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500">
        <h2 className="text-lg font-semibold text-white">Chats</h2>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant={filterOptions.onlyUnread ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterOptions(prev => ({ 
              ...prev, 
              onlyUnread: !prev.onlyUnread 
            }))}
          >
            Unread
          </Button>
          <Button
            variant={filterOptions.onlyVerified ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterOptions(prev => ({ 
              ...prev, 
              onlyVerified: !prev.onlyVerified 
            }))}
          >
            Verified Only
          </Button>
          <Select
            value={filterOptions.sortBy}
            onValueChange={(value: 'recent' | 'unread' | 'alphabetical') => 
              setFilterOptions(prev => ({ ...prev, sortBy: value }))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="unread">Unread First</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          <AnimatePresence>
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto bg-muted hover:bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                  onClick={() => onSelectChat?.(chat.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback>{chat.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-white">{chat.name}</span>
                          {chat.isPremium && (
                            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-white whitespace-nowrap">{chat.time}</span>
                      </div>
                      <p className="text-sm text-white truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white">
                        {chat.unread}
                      </Badge>
                    )}
                  </div>
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}
