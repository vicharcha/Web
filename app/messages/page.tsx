"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  Paperclip,
  Mic,
  Search,
  MoreVertical,
  ImageIcon,
  Smile,
  Check,
  Phone,
  Video,
  Star,
  Users,
  Archive,
  ArrowLeft,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"

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

  const groups = [
    {
      id: "g1",
      name: "Project Team",
      participants: 8,
      lastMessage: "Meeting at 3 PM",
      time: "11:30 am",
      unread: 5,
      status: "active",
      icon: "🚀",
    },
    {
      id: "g2",
      name: "Family Group",
      participants: 12,
      lastMessage: "Happy Birthday! 🎂",
      time: "10:15 am",
      unread: 0,
      status: "active",
      icon: "👨‍👩‍👧‍👦",
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

  interface Chat {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    status: string;
    hasMedia: boolean;
    isTyping: boolean;
    isFavorite: boolean;
    isArchived: boolean;
  }

  const renderChatList = (chats: Chat[]) => (
    <div className="space-y-1">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => setSelectedChat(chat.id)}
          className={cn(
            "flex items-center space-x-4 p-3 cursor-pointer hover:bg-accent rounded-lg transition-colors",
            selectedChat === chat.id && "bg-accent",
          )}
        >
          <div className="relative">
            <Avatar>
              <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={chat.name} />
              <AvatarFallback>{chat.name[0]}</AvatarFallback>
            </Avatar>
            {chat.status === "online" && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <p className="font-medium truncate">{chat.name}</p>
                {chat.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
              </div>
              <p className="text-xs text-muted-foreground">{chat.time}</p>
            </div>
            <div className="flex items-center">
              {chat.hasMedia && <ImageIcon className="h-3 w-3 mr-1 text-muted-foreground" />}
              <p className="text-sm text-muted-foreground truncate">{chat.isTyping ? "typing..." : chat.lastMessage}</p>
            </div>
          </div>
          {chat.unread > 0 && (
            <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {chat.unread}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const renderGroups = () => (
    <div className="space-y-1">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => setSelectedChat(group.id)}
          className={cn(
            "flex items-center space-x-4 p-3 cursor-pointer hover:bg-accent rounded-lg transition-colors",
            selectedChat === group.id && "bg-accent",
          )}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
              {group.icon}
            </div>
            {group.status === "active" && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <p className="font-medium truncate">{group.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {group.participants} members
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{group.time}</p>
            </div>
            <p className="text-sm text-muted-foreground truncate">{group.lastMessage}</p>
          </div>
          {group.unread > 0 && (
            <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {group.unread}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  const ChatList = () => (
    <div className="w-full md:w-[400px] border-r flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search or start new chat" className="pl-9" />
        </div>
      </div>

      <Tabs defaultValue="all" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <div className="px-3 pt-3">
          <TabsList className="grid w-full grid-cols-4 h-9">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              <div className="flex items-center gap-1">
                Unread
                <Badge variant="secondary">3</Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
              </div>
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-3">
          <TabsContent value="all" className="m-0">
            {allChats.some((chat) => chat.isArchived) && (
              <div className="mb-2">
                <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                  <Archive className="h-4 w-4" />
                  <span>Archived</span>
                </div>
                {renderChatList(allChats.filter((chat) => chat.isArchived))}
              </div>
            )}
            <div className="mt-2">{renderChatList(allChats.filter((chat) => !chat.isArchived))}</div>
          </TabsContent>

          <TabsContent value="unread" className="m-0">
            <div className="bg-accent/50 rounded-lg p-3 mb-3">
              <h3 className="font-medium mb-1">Unread Messages</h3>
              <p className="text-sm text-muted-foreground">You have 3 unread conversations</p>
            </div>
            {renderChatList(allChats.filter((chat) => chat.unread > 0))}
          </TabsContent>

          <TabsContent value="favorites" className="m-0">
            <div className="bg-accent/50 rounded-lg p-3 mb-3">
              <h3 className="font-medium mb-1">Favorite Chats</h3>
              <p className="text-sm text-muted-foreground">Quick access to important conversations</p>
            </div>
            {renderChatList(allChats.filter((chat) => chat.isFavorite))}
          </TabsContent>

          <TabsContent value="groups" className="m-0">
            <div className="bg-accent/50 rounded-lg p-3 mb-3">
              <h3 className="font-medium mb-1">Your Groups</h3>
              <p className="text-sm text-muted-foreground">Manage and participate in group conversations</p>
            </div>
            <div className="flex justify-end mb-3">
              <Button variant="outline" size="sm" className="text-xs">
                <Users className="h-4 w-4 mr-1" />
                Create New Group
              </Button>
            </div>
            {renderGroups()}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  )

  const ChatView = () => (
    <div className="flex-1 flex flex-col h-full">
      <div className="h-14 border-b flex items-center justify-between px-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center space-x-3">
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
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "you" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "rounded-lg max-w-[70%]",
                  message.sender === "you" ? "bg-primary text-primary-foreground" : "bg-accent",
                )}
              >
                {message.media && (
                  <div className="p-1">
                    <img
                      src={message.media.url || "/placeholder.svg"}
                      alt={message.media.caption}
                      className="rounded-md max-h-[300px] w-auto"
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
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
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
    <div className="flex h-screen bg-background">
      {(!isMobile || !selectedChat) && <ChatList />}
      {(!isMobile || selectedChat) && <ChatView />}
    </div>
  )
}
