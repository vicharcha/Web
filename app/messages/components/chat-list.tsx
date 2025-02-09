"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Search, Filter, Users, Star, PlusCircle, ImageIcon, Clock, MoreHorizontal } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ChatListProps {
  chats: Array<{
    id: string
    name: string
    lastMessage: string
    time: string
    unread: number
    status: string
    hasMedia: boolean
    isTyping: boolean
    isFavorite: boolean
    isArchived?: boolean
    isGroup?: boolean
    avatar: string
    isPremium?: boolean
  }>
  selectedChat: string | null
  onSelectChat: (chatId: string) => void
}

export function ChatList({ chats, selectedChat, onSelectChat }: ChatListProps) {
  return (
    <Card className="w-full h-full border-r flex flex-col bg-card relative">
      {/* List Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Messages</h2>
          <Button variant="secondary" size="icon" className="ml-auto rounded-full hover:scale-105 transition-transform">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            <Input
              placeholder="Search messages..."
              className="pl-9 w-full bg-muted/50 border-none focus-visible:ring-1 rounded-full"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Messages</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Clock className="mr-2 h-4 w-4" /> Recent
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Star className="mr-2 h-4 w-4" /> Favorites
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ImageIcon className="mr-2 h-4 w-4" /> With Media
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50">
            <TabsTrigger value="all" className="text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative text-sm">
              Unread
              <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center">
                {chats.reduce((acc, chat) => acc + chat.unread, 0)}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-sm">
              <Users className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-sm">
              <Star className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 px-2 py-4">
        <AnimatePresence>
          {chats.map((chat) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "w-full flex items-center space-x-4 p-3 rounded-xl transition-all",
                "hover:bg-accent/50 active:scale-[0.98]",
                selectedChat === chat.id && "bg-accent/50 shadow-sm ring-1 ring-accent",
                "my-1 relative group",
              )}
            >
              <div className="relative">
                <Avatar
                  className={cn(
                    "h-12 w-12 border-2 border-background transition-transform hover:scale-105",
                    chat.isPremium && "ring-2 ring-amber-500",
                  )}
                >
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.status === "online" && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 ring-2 ring-background animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-sm truncate">{chat.name}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                </div>
                <div className="flex flex-col text-xs text-muted-foreground">
                  {chat.status === "online" && (
                    <span className="text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      online
                    </span>
                  )}
                  {chat.isTyping && (
                    <span className="text-blue-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      typing...
                    </span>
                  )}
                  {!chat.isTyping && chat.lastMessage && (
                    <p className="truncate opacity-70">{chat.lastMessage}</p>
                  )}
                </div>
              </div>

              {/* Hover Actions */}
              <AnimatePresence>
                {selectedChat !== chat.id && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  )
}

