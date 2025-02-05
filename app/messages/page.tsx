"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
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
  PlusCircle,
  Smile,
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
import { CallDialog } from "./components/call-dialog"
import { ProfileInfo } from "./components/profile-info"
import { MediaGallery } from "./components/media-gallery"
import { EmojiPicker } from "./components/emoji-picker"

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [messageText, setMessageText] = useState("")
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isProfileInfoOpen, setIsProfileInfoOpen] = useState(false)
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
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
      isGroup: false,
      avatar: "/placeholder.svg?height=40&width=40&text=JS",
    },
    {
      id: "2",
      name: "Project Team",
      lastMessage: "Meeting at 3 PM",
      time: "10:15 am",
      unread: 3,
      status: "online",
      hasMedia: false,
      isTyping: true,
      isFavorite: true,
      isArchived: false,
      isGroup: true,
      avatar: "/placeholder.svg?height=40&width=40&text=PT",
    },
    // ... other chats
  ]

interface Media {
  url: string;
  caption: string;
}

const messages: { id: number; sender: string; content: string; time: string; status: string; media: Media | null }[] = [
  {
    id: 1,
    sender: "them",
    content: "Complete front end and give",
    time: "12:29 am",
    status: "read",
    media: null, // Add media property
  },
    // ... other messages
  ]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [scrollRef]) // Corrected dependency

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add the new message to the messages array
      // This is a placeholder. In a real app, you'd send this to your backend
      const newMessage = {
        id: messages.length + 1,
        sender: "you",
        content: messageText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      };
      // messages.push(newMessage)
      setMessageText("");
      // Scroll to bottom
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  const ChatList = () => (
    <Card className="w-full md:w-[380px] border-r flex flex-col h-full bg-card">
      <div className="p-4 border-b">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Messages</h2>
          <Button variant="ghost" size="icon" className="ml-auto">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-9 w-full bg-muted/50 border-none focus-visible:ring-1" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Chats</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span className="mr-2">📥</span> Unread
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="mr-2">🗄️</span> Archived
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="mr-2">⭐</span> Favorites
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50">
            <TabsTrigger value="all" className="text-sm">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="relative text-sm">
              Unread
              <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center">
                3
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

      <ScrollArea className="flex-1 px-2">
        <AnimatePresence>
          {allChats.map((chat) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "w-full flex items-center space-x-4 p-4 rounded-lg transition-all hover:bg-accent",
                selectedChat === chat.id && "bg-accent shadow-sm",
                "my-1",
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.status === "online" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold truncate">{chat.name}</p>
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
            </motion.button>
          ))}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  )

  const ChatView = () => (
    <div className="flex-1 flex flex-col h-full bg-background">
      <div className="h-20 border-b flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Contact" />
            <AvatarFallback>C</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">+91 91828 83649</p>
            <p className="text-sm text-muted-foreground flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              online
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsCallDialogOpen(true)}>
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsCallDialogOpen(true)}>
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsProfileInfoOpen(true)}>
                <Users className="mr-2 h-4 w-4" /> View Contact
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsMediaGalleryOpen(true)}>
                <ImageIcon className="mr-2 h-4 w-4" /> Media & Files
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" /> Search
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Block Contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", message.sender === "you" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "rounded-2xl max-w-[70%] shadow-sm",
                  message.sender === "you" ? "bg-primary text-primary-foreground" : "bg-accent",
                )}
              >
{message.media && (
  <div className="p-1">
    <img
      src={message.media.url}
      alt={message.media.caption}
      className="rounded-lg max-h-[300px] w-auto object-cover"
    />
  </div>
)}
                <div className="p-4">
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
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsEmojiPickerOpen(true)}>
            <Smile className="h-5 w-5" />
          </Button>
          <MessageAttachments />
          <Input
            placeholder="Type a message..."
            className="flex-1 bg-muted/50 border-none focus-visible:ring-1"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon" className="rounded-full" disabled={!messageText.trim()} onClick={handleSendMessage}>
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
      <CallDialog isOpen={isCallDialogOpen} onClose={() => setIsCallDialogOpen(false)} />
      <ProfileInfo isOpen={isProfileInfoOpen} onClose={() => setIsProfileInfoOpen(false)} />
      <MediaGallery isOpen={isMediaGalleryOpen} onClose={() => setIsMediaGalleryOpen(false)} />
      <EmojiPicker
        isOpen={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onEmojiSelect={(emoji) => setMessageText((prev) => prev + emoji)}
      />
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <div className="inline-block p-6 bg-primary/5 rounded-full">
          <MessageSquare className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold">Select a chat to start messaging</h3>
        <p className="text-muted-foreground max-w-sm">Choose from your existing conversations or start a new one.</p>
        <Button className="mt-4">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </motion.div>
    </div>
  )
}
