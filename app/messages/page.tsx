"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import {
  Send,
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

// Import components
import { MessageAttachments } from "./components/message-attachments"
import { CallDialog } from "./components/call-dialog"
import { ProfileInfo } from "./components/profile-info"
import { MediaGallery } from "./components/media-gallery"
import { EmojiPickerDialog } from "./components/emoji-picker"

// Types
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
  isArchived?: boolean;
  isGroup?: boolean;
  avatar: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  status: string;
  media?: {
    url: string;
    caption: string;
  };
}

// Sample chat data
const allChats: Chat[] = [
  {
    id: "1",
    name: "+91 91828 83649",
    lastMessage: "Bot: Hi, how are you?",
    time: "now",
    unread: 1,
    status: "online",
    hasMedia: false,
    isTyping: true,
    isFavorite: true,
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
]

export default function ChatApp() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isProfileInfoOpen, setIsProfileInfoOpen] = useState(false)
  const [isMediaGalleryOpen, setIsMediaGalleryOpen] = useState(false)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "you",
        content: messageText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
      }
      
      setMessages(prevMessages => [...prevMessages, newMessage])
      setMessageText("")

      // Bot response for "hi" - using local state update to prevent page refresh
      if (messageText.toLowerCase().trim() === "hi") {
        const newId = messages.length + 2; // Skip one ID to account for user message
        const botResponse = {
          id: newId,
          sender: "them",
          content: "How are you?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          status: "sent",
        };
        
        // Queue bot response with a slight delay
        const timeoutId = setTimeout(() => {
          setMessages(prev => [...prev, botResponse]);
        }, 1000);
        
        // Clean up timeout if component unmounts
        return () => clearTimeout(timeoutId);
      }
    }
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const newMessage = {
        id: messages.length + 1,
        sender: "you",
        content: "",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "sent",
        media: {
          url: e.target?.result as string,
          caption: file.name
        }
      }
      setMessages(prevMessages => [...prevMessages, newMessage])
    }
    reader.readAsDataURL(file)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Chat List Component
  const ChatList = () => (
    <Card className="w-full md:w-[380px] border-r flex flex-col h-full bg-card">
      {/* Chat list header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Messages</h2>
          <Button variant="secondary" size="icon" className="ml-auto rounded-full hover:scale-105 transition-transform">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search and filter */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            <Input 
              placeholder="Search chats..." 
              className="pl-9 w-full bg-muted/50 border-none focus-visible:ring-1 rounded-full"
            />
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

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 p-1 bg-muted/50">
            <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
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

      {/* Chat list */}
      <ScrollArea className="flex-1 px-2 smooth-scroll">
        <AnimatePresence>
          {allChats.map((chat) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => setSelectedChat(chat.id)}
              className={cn(
                "w-full flex items-center space-x-4 p-4 rounded-xl transition-all",
                "hover:bg-accent/50 active:scale-[0.99]",
                selectedChat === chat.id && "bg-accent/50 shadow-sm ring-1 ring-accent",
                "my-1.5",
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-background transition-transform hover:scale-105">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                {chat.status === "online" && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full ring-2 ring-background animate-pulse" />
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

  // Chat View Component
  const ChatView = () => (
    <div className="flex-1 flex flex-col h-full bg-background">
      {/* Chat header */}
      <div className="h-20 border-b flex items-center justify-between px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center space-x-4">
          <div className="relative group cursor-pointer" onClick={() => setIsProfileInfoOpen(true)}>
            <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all duration-300">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Contact" />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <div className="opacity-0 group-hover:opacity-100 absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-background text-xs px-2 py-0.5 rounded-full border transition-opacity duration-200 whitespace-nowrap">
              View Profile
            </div>
          </div>
          <div>
            <p className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer"
               onClick={() => setIsProfileInfoOpen(true)}
            >
              +91 91828 83649
            </p>
            <div className="flex flex-col space-y-1">
              <div className="text-sm text-muted-foreground flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span className="font-medium text-green-500">online</span>
              </div>
              {selectedChat === "1" && (
                <div className="text-xs text-muted-foreground flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-bounce" />
                  <span className="italic">Bot is typing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat actions */}
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
            <DropdownMenuContent align="end">
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

      {/* Messages area */}

<ScrollArea className="flex-1 p-6 smooth-scroll" ref={scrollRef}>
  <div className="space-y-6">
    {messages.map((message) => (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex", 
          message.sender === "you" ? "justify-end" : "justify-start",
          "group"
        )}
      >
        <div
          className={cn(
            "rounded-2xl max-w-[70%]",
            "transform transition-transform duration-200 hover:scale-[1.02]",
            message.sender === "you" 
              ? "bg-primary text-primary-foreground shadow-lg hover:shadow-primary/20" 
              : "bg-accent shadow-lg hover:shadow-accent/20"
          )}
        >
          {message.media && (
            <div className="p-1">
              <img
                src={message.media.url || "/placeholder.svg"}
                alt={message.media.caption}
                className="rounded-lg max-h-[300px] w-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setIsMediaGalleryOpen(true)}
              />
              {message.media.caption && (
                <p className="text-sm opacity-70 px-2 py-1">{message.media.caption}</p>
              )}
            </div>
          )}
          <div className="p-4">
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
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

{/* Message input area */}
<div className="p-6 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="flex items-center space-x-4">
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full hover:bg-primary/10"
      onClick={() => setIsEmojiPickerOpen(true)}
    >
      <Smile className="h-5 w-5" />
    </Button>
    <MessageAttachments onFileSelect={handleImageUpload} />
    <Input
      placeholder="Type a message..."
      className="flex-1 bg-muted/50 border-none focus-visible:ring-1 rounded-full px-4"
      value={messageText}
      onChange={(e) => setMessageText(e.target.value)}
      onKeyPress={handleKeyPress}
    />
    <Button 
      size="icon" 
      className={cn(
        "rounded-full transition-all duration-200",
        messageText.trim() 
          ? "bg-primary hover:bg-primary/90 hover:scale-105" 
          : "bg-muted"
      )} 
      disabled={!messageText.trim()} 
      onClick={handleSendMessage}
    >
      <Send className="h-5 w-5" />
    </Button>
  </div>
</div>

{/* Modals and dialogs */}
<CallDialog isOpen={isCallDialogOpen} onClose={() => setIsCallDialogOpen(false)} />
<ProfileInfo isOpen={isProfileInfoOpen} onClose={() => setIsProfileInfoOpen(false)} />
<MediaGallery isOpen={isMediaGalleryOpen} onClose={() => setIsMediaGalleryOpen(false)} />
<EmojiPickerDialog
  isOpen={isEmojiPickerOpen}
  onClose={() => setIsEmojiPickerOpen(false)}
  onEmojiSelect={(emoji) => setMessageText((prev) => prev + emoji)}
/>
</div>
)

// Empty state component
const EmptyState = () => (
<div className="flex-1 flex items-center justify-center bg-background">
<motion.div 
  initial={{ opacity: 0, y: 20 }} 
  animate={{ opacity: 1, y: 0 }} 
  className="text-center space-y-4"
>
  <div className="inline-block p-6 bg-primary/5 rounded-full">
    <MessageSquare className="h-12 w-12 text-primary" />
  </div>
  <h3 className="text-2xl font-semibold">Select a chat to start messaging</h3>
  <p className="text-muted-foreground max-w-sm">
    Choose from your existing conversations or start a new one.
  </p>
  <Button className="mt-4">
    <PlusCircle className="mr-2 h-4 w-4" />
    New Message
  </Button>
</motion.div>
</div>
)

// Main layout
return (
<div className="flex h-[calc(100vh-4rem)] bg-background">
{(!isMobile || !selectedChat) && <ChatList />}
{(!isMobile || selectedChat) && (selectedChat ? <ChatView /> : <EmptyState />)}
</div>
)
}
