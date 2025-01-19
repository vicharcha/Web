"use client"

import { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, Video, Paperclip, ImageIcon, Smile, Mic, Send, ChevronLeft, MoreVertical, Play, X } from 'lucide-react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  timestamp: string
  sender: 'user' | 'other'
  status: 'sent' | 'delivered' | 'read'
  reactions?: string[]
  replyTo?: {
    id: string
    content: string
  }
  type: 'text' | 'voice' | 'image'
  voiceDuration?: number
  imageUrl?: string
}

interface ChatInterfaceProps {
  chatId: string | null
  onBack?: () => void
}

export function ChatInterface({ chatId, onBack }: ChatInterfaceProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const recordingTimeoutRef = useRef<NodeJS.Timeout>()
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    // Simulate initial messages
    setMessages([
      {
        id: '1',
        content: 'Hello! How can I help you today?',
        timestamp: '10:00 AM',
        sender: 'other',
        status: 'read',
        type: 'text'
      },
      {
        id: '2',
        content: 'I have a question about the new feature.',
        timestamp: '10:05 AM',
        sender: 'user',
        status: 'read',
        type: 'text'
      }
    ])
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() && !replyingTo) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sender: 'user',
      status: 'sent',
      type: 'text',
      ...(replyingTo && {
        replyTo: {
          id: replyingTo.id,
          content: replyingTo.content
        }
      })
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')
    setReplyingTo(null)

    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you with that feature question!",
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sender: 'other',
        status: 'sent',
        type: 'text'
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const handleSwipe = (message: Message) => (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50) {
      setReplyingTo(message)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingDuration(0)
    recordingTimeoutRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (recordingTimeoutRef.current) {
      clearInterval(recordingTimeoutRef.current)
    }
    setIsRecording(false)
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: 'Voice message',
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sender: 'user',
      status: 'sent',
      type: 'voice',
      voiceDuration: recordingDuration
    }

    setMessages(prev => [...prev, newMessage])
    setRecordingDuration(0)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        const newMessage: Message = {
          id: Date.now().toString(),
          content: 'Image',
          timestamp: new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          sender: 'user',
          status: 'sent',
          type: 'image',
          imageUrl: reader.result as string
        }
        setMessages(prev => [...prev, newMessage])
      }
      reader.readAsDataURL(file)
    }
  }

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Select a chat to start messaging</h2>
          <p className="text-muted-foreground">Choose from your conversations on the left</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onBack}
              className="text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-white">Chat with {chatId}</h2>
            <p className="text-sm text-white/70">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
            <Phone className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
            <Video className="h-5 w-5" />
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/10">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Chat Settings</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <Button variant="outline" className="w-full justify-start" onClick={() => {
                  toast({
                    title: "Chat cleared",
                    description: "All messages have been cleared from this chat."
                  })
                  setMessages([])
                }}>
                  Clear Chat
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                drag="x"
                dragConstraints={{ left: 0, right: 100 }}
                onDragEnd={handleSwipe(msg)}
                className={cn(
                  "flex items-start gap-3",
                  msg.sender === 'user' && "flex-row-reverse"
                )}
              >
                <Avatar className="mt-1">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{msg.sender === 'user' ? 'U' : 'AI'}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "max-w-[80%]",
                  msg.sender === 'user' 
                    ? "bg-primary text-primary-foreground rounded-lg rounded-tr-none" 
                    : "bg-muted rounded-lg rounded-tl-none"
                )}>
                  {msg.replyTo && (
                    <div className="px-3 pt-2 pb-1 -mb-1 text-sm border-l-2 border-purple-500 bg-background/10 rounded-t-lg">
                      <p className="opacity-70 text-xs">Replying to</p>
                      <p className="truncate">{msg.replyTo.content}</p>
                    </div>
                  )}
                  <div className="p-3">
                    {msg.type === 'text' && (
                      <p>{msg.content}</p>
                    )}
                    {msg.type === 'voice' && (
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                        <div className="h-1 flex-1 bg-background/20 rounded-full" />
                        <span className="text-xs">{msg.voiceDuration}s</span>
                      </div>
                    )}
                    {msg.type === 'image' && msg.imageUrl && (
                      <Image 
                        src={msg.imageUrl || "/placeholder.svg"} 
                        alt={`Shared content from ${msg.sender}`}
                        width={300}
                        height={200}
                        className="rounded-lg max-w-full"
                      />
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-70">{msg.timestamp}</span>
                      {msg.sender === 'user' && (
                        <span className="text-xs opacity-70">
                          {msg.status === 'read' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <Avatar className="mt-1">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg rounded-tl-none p-3">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-current rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-current rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-current rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {replyingTo && (
        <div className="px-4 py-2 border-t flex items-center gap-2">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Replying to</p>
            <p className="text-sm truncate">{replyingTo.content}</p>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setReplyingTo(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="image-upload"
            aria-label="Upload image"
            onChange={handleFileUpload}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <label htmlFor="image-upload">
              <Paperclip className="h-5 w-5" />
            </label>
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Smile className="h-5 w-5" />
          </Button>
          <Input 
            placeholder="Type a message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          {message.trim() ? (
            <Button 
              size="icon" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "text-muted-foreground hover:text-foreground",
                isRecording && "text-red-500 hover:text-red-600"
              )}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

