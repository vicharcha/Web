"use client"

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Search, Filter } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

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

type Group = {
  id: string
  name: string
  members: number
  lastMessage: string
  time: string
  isVerified: boolean
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

const groups: Group[] = [
  { 
    id: '1', 
    name: 'Family', 
    members: 5, 
    lastMessage: 'Mom: Dinner at 7', 
    time: '11:45 AM',
    isVerified: true
  },
  { 
    id: '2', 
    name: 'Work Team', 
    members: 8, 
    lastMessage: 'Meeting notes shared', 
    time: '10:30 AM',
    isVerified: true
  },
  { 
    id: '3', 
    name: 'Friends', 
    members: 12, 
    lastMessage: 'Movie this weekend?', 
    time: 'Yesterday',
    isVerified: false
  }
]

interface ChatSectionProps {
  onSelectChat?: (chatId: string) => void
}

export function ChatSection({ onSelectChat }: ChatSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="chats" className="w-full">
        <div className="sticky top-0 bg-background z-10 border-b">
          <TabsList className="w-full grid grid-cols-2 p-0">
            <TabsTrigger value="chats" className="py-4">Chats</TabsTrigger>
            <TabsTrigger value="groups" className="py-4">Groups</TabsTrigger>
          </TabsList>
          <div className="p-4 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-9 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                Verified Only
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="chats" className="m-0">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <AnimatePresence>
              {chats
                .filter(chat => 
                  chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((chat) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start py-6 px-4 hover:bg-muted/50"
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback>{chat.name[0]}</AvatarFallback>
                        </Avatar>
                        {chat.isVerified && (
                          <Badge 
                            variant="secondary" 
                            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-500"
                          >
                            <CheckCircle className="h-3 w-3 text-white" />
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{chat.name}</h3>
                            {chat.isPremium && (
                              <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                Premium
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{chat.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="ml-2 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                          {chat.unread}
                        </div>
                      )}
                    </Button>
                  </motion.div>
                ))}
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="groups" className="m-0 flex-1">
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-2 space-y-2">
              {groups.map((group) => (
                <Button
                  key={group.id}
                  variant="ghost"
                  onClick={() => onSelectChat?.(`group-${group.id}`)}
                  className="w-full justify-start py-6 px-4 hover:bg-muted/50"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={`/placeholder.svg?group=${group.id}`} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    {group.isVerified && (
                      <Badge 
                        variant="secondary" 
                        className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-500"
                      >
                        <CheckCircle className="h-3 w-3 text-white" />
                      </Badge>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{group.name}</h3>
                      <span className="text-xs text-muted-foreground">{group.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{group.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">{group.members} members</p>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
