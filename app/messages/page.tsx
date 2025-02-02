"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  Mic,
  Search,
  MoreVertical,
  ImageIcon,
  Check,
  Phone,
  Video,
  Star,
  Users,
  Filter,
  MessageSquare,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageAttachments } from "./components/message-attachments"

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const allChats = [
    {
      id: "1",
      name: "+91 91828 83649",
      lastMessage: "Complete front end and give",
      time: "12:29 am",
      unread: 0,
      status: "online",
      hasMedia: true,
      isTyping: false,
      isFavorite: false,
      isArchived: false,
    },
    {
      id: "2",
      name: "Raj Mahesh",
      lastMessage: "Guys, the ES exam timing has been shifted",
      time: "12:01 am",
      unread: 2,
      status: "offline",
      hasMedia: false,
      isTyping: true,
      isFavorite: true,
      isArchived: false,
    },
    {
      id: "3",
      name: "Atal B-202",
      lastMessage: "🎵 Audio message",
      time: "Yesterday",
      unread: 1,
      status: "offline",
      hasMedia: true,
      isTyping: false,
      isFavorite: false,
      isArchived: true,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "them",
      content: "Complete front end and give",
      time: "12:29 am",
      status: "read",
    },
    {
      id: 2,
      sender: "you",
      content: "ahhhhhhhhhh! inka kaledu",
      time: "12:30 am",
      status: "read",
      media: {
        type: "image",
        url: "/placeholder.svg?height=200&width=300",
        caption: "Screenshot 1",
      },
    },
    {
      id: 3,
      sender: "you",
      content: "model",
      time: "12:30 am",
      status: "read",
      media: {
        type: "image",
        url: "/placeholder.svg?height=200&width=300",
        caption: "Screenshot 2",
      },
    },
  ]

  const ChatList = () => (
    <div className="w-full md:w-[380px] border-r flex flex-col h-full bg-background">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search or start new chat" className="pl-9 w-full" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Chats</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Unread</DropdownMenuItem>
              <DropdownMenuItem>Archived</DropdownMenuItem>
              <DropdownMenuItem>Favorites</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              <Badge variant="secondary" className="absolute -top-2 -right-2">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="groups">
              <Users className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="favorites">
              <Star className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {allChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "w-full flex items-center space-x-4 p-3 rounded-lg transition-colors hover:bg-accent",
                selectedChat === chat.id && "bg-accent",
              )}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={chat.name} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.status === "online" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{chat.name}</p>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  {chat.hasMedia && <ImageIcon className="h-3 w-3 mr-1" />}
                  <p className="truncate">{chat.isTyping ? "typing..." : chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <Badge variant="default" className="ml-2">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  const ChatView = () => (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="h-16 border-b flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt="Contact" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">+91 91828 83649</p>
            <p className="text-xs text-muted-foreground">online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Contact</DropdownMenuItem>
              <DropdownMenuItem>Media, links, and docs</DropdownMenuItem>
              <DropdownMenuItem>Search</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Block</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "you" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "rounded-lg max-w-[70%]",
                  message.sender === "you" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {message.media && (
                  <div className="p-1">
                    <img
                      src={message.media.url || "/placeholder.svg"}
                      alt={message.media.caption}
                      className="rounded-md max-h-[300px] w-auto object-cover"
                    />
                  </div>
                )}
                <div className="p-3 pt-2">
                  <p>{message.content}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <p className="text-xs opacity-70">{message.time}</p>
                    {message.sender === "you" && (
                      <div className="flex text-xs opacity-70">
                        <Check className="h-3 w-3" />
                        {message.status === "read" && <Check className="h-3 w-3 -ml-1" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <MessageAttachments />
          <Input placeholder="Type a message" className="flex-1" />
          <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {(!isMobile || !selectedChat) && <ChatList />}
      {(!isMobile || selectedChat) && (selectedChat ? <ChatView /> : <EmptyState />)}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="inline-block p-6 bg-muted rounded-full">
          <MessageSquare className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">Select a chat to start messaging</h3>
        <p className="text-muted-foreground">Choose from your existing conversations or start a new one.</p>
      </div>
    </div>
  )
}

