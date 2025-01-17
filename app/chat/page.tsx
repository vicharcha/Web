"use client"

import { useState } from 'react'
import { ChatSection } from '@/components/chat-section'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Paperclip, Mic, Image, Smile, Video, Phone, MoreVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  timestamp: string
  sender: 'user' | 'other'
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      sender: 'user'
    }

    setMessages(prev => [...prev, newMessage])
    setMessage('')
    
    // Simulate typing indicator
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Simulate response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }),
        sender: 'other'
      }
      setMessages(prev => [...prev, response])
    }, 2000)
  }

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      <ChatSection onSelectChat={handleSelectChat} />
      <div className="flex-1 border-l flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" alt="Placeholder" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">Chat with {selectedChat}</h2>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground ml-12 rounded-br-none'
                            : 'bg-muted mr-12 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1 text-right">{msg.timestamp}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <div className="flex gap-1">
                      <span className="animate-bounce-dot" />
                      <span className="animate-bounce-dot animation-delay-200" />
                      <span className="animate-bounce-dot animation-delay-400" />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Image className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Smile className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button 
                  type="submit" 
                  variant={message.trim() ? "default" : "ghost"}
                  className={message.trim() ? "" : "hover:bg-muted"}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <motion.div
            className="h-full flex flex-col items-center justify-center p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-semibold mb-3">AI Assistant Coming Soon!</h3>
              <p className="text-muted-foreground mb-4">
                Get ready for intelligent conversations and personalized help.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-medium mb-2">Smart Responses</h4>
                  <p className="text-sm text-muted-foreground">Powered by advanced AI</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-medium mb-2">24/7 Available</h4>
                  <p className="text-sm text-muted-foreground">Always here to help</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}