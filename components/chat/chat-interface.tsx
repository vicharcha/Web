import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Mic, Image as ImageIcon, Paperclip, Smile, Play, Check, AlertCircle } from 'lucide-react'
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  timestamp: string
  sender: 'user' | 'other'
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  type: 'text' | 'image' | 'audio'
  metadata?: {
    fileUrl?: string
    fileName?: string
    duration?: number
  }
}

interface ChatInterfaceProps {
  chatId: string;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const recordingTimer = useRef<NodeJS.Timeout>()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const validateMessage = (content: string): boolean => {
    if (!content.trim()) {
      setError('Message cannot be empty')
      return false
    }
    if (content.length > 500) {
      setError('Message is too long (max 500 characters)')
      return false
    }
    setError(null)
    return true
  }

  const handleSendMessage = async () => {
    if (!validateMessage(newMessage)) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user',
      status: 'sending',
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        )
      )

      // Simulate typing indicator
      setIsTyping(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsTyping(false)

      // Simulate response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thanks for your message! I\'ll get back to you soon.',
        timestamp: new Date().toLocaleTimeString(),
        sender: 'other',
        status: 'read',
        type: 'text'
      }
      setMessages(prev => [...prev, response])
    } catch {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'failed' } : msg
        )
      )
      setError('Failed to send message. Please try again.')
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingDuration(0)
    recordingTimer.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = async () => {
    if (recordingTimer.current) {
      clearInterval(recordingTimer.current)
    }
    setIsRecording(false)

    // Simulate audio processing
    const audioMessage: Message = {
      id: Date.now().toString(),
      content: 'Voice message',
      timestamp: new Date().toLocaleTimeString(),
      sender: 'user',
      status: 'sending',
      type: 'audio',
      metadata: {
        duration: recordingDuration
      }
    }

    setMessages(prev => [...prev, audioMessage])
    setRecordingDuration(0)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "flex items-start gap-2",
                  message.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex items-start gap-2",
                  message.sender === 'user' && "flex-row-reverse"
                )}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {message.sender === 'user' ? 'U' : 'O'}
                    </AvatarFallback>
                  </Avatar>

                  <div className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    message.sender === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted rounded-tl-none"
                  )}>
                    {message.type === 'text' && (
                      <p className="text-sm">{message.content}</p>
                    )}

                    {message.type === 'audio' && (
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Play className="h-4 w-4" />
                        </Button>
                        <div className="h-1 w-32 bg-primary/20 rounded-full" />
                        <span className="text-xs">
                          {message.metadata?.duration}s
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-70">
                        {message.timestamp}
                      </span>
                      {message.sender === 'user' && (
                        <div className="flex items-center">
                          {message.status === 'failed' ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertCircle className="h-3 w-3 text-destructive" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Failed to send. Click to retry.
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <div className="flex">
                              <Check className={cn(
                                "h-3 w-3",
                                message.status === 'read' && "text-blue-500"
                              )} />
                              {message.status === 'read' && (
                                <Check className="h-3 w-3 -ml-1 text-blue-500" />
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <motion.div
                className="h-2 w-2 bg-current rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              <motion.div
                className="h-2 w-2 bg-current rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="h-2 w-2 bg-current rounded-full"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
          )}
        </div>
      </ScrollArea>

      {error && (
        <Alert variant="destructive" className="mx-4 my-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            className="flex-1"
            maxLength={500}
          />
          {newMessage.trim() ? (
            <Button onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
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
