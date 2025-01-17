"use client"

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Search } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { AnimatePresence, motion } from "framer-motion"

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

interface ChatSidebarProps {
  onSelectChat: (chatId: string) => void
}

export function ChatSidebar({ onSelectChat }: ChatSidebarProps) {
  // const [activeTab, setActiveTab] = useState('chats')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOptions, setFilterOptions] = useState({
    onlyUnread: false,
    onlyVerified: false,
    sortBy: 'recent' as 'recent' | 'unread' | 'alphabetical'
  });

  const filteredChats = chats
    .filter(chat => {
      if (filterOptions.onlyUnread && chat.unread === 0) return false;
      if (filterOptions.onlyVerified && !chat.isVerified) return false;
      if (searchQuery && !chat.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filterOptions.sortBy) {
        case 'unread':
          return b.unread - a.unread;
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0; // Keep original order for recent
      }
    });

  return (
    <div className="w-full md:w-80 h-full border-r flex flex-col bg-background">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chats..."
            className="pl-9 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="chats" className="flex-1">
        <TabsList className="w-full grid grid-cols-2 p-0">
          <TabsTrigger value="chats" className="py-3">Chats</TabsTrigger>
          <TabsTrigger value="groups" className="py-3">Groups</TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="m-0 flex-1">
          <div className="p-2">
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
            
            <div className="flex gap-2 mt-2">
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
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-2 space-y-2">
              <AnimatePresence>
                {filteredChats
                  .map((chat) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto"
                        onClick={() => onSelectChat(chat.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar>
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
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium truncate">{chat.name}</span>
                                {chat.isPremium && (
                                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                    Premium
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{chat.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                          </div>
                          {chat.unread > 0 && (
                            <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
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
        </TabsContent>

        <TabsContent value="groups" className="m-0 flex-1">
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="p-2 space-y-2">
              {groups
                .filter(group => 
                  group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  group.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((group) => (
                  <Button
                    key={group.id}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto"
                    onClick={() => onSelectChat(`group-${group.id}`)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{group.name}</span>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{group.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{group.lastMessage}</p>
                        <p className="text-xs text-muted-foreground">{group.members} members</p>
                      </div>
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
