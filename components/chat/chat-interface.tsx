"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Search, MoreVertical, Paperclip, Send, Smile, Image as ImageIcon, ChevronLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: 'user' | 'other'
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

interface ChatContact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread?: number
}

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [input, setInput] = useState('')
  const [contacts] = useState<ChatContact[]>([
    {
      id: '1',
      name: 'Raj Mahesh',
      avatar: '/placeholder.svg',
      lastMessage: 'Anna oka full stack website motham idhe develop...',
      timestamp: 'Yesterday',
      unread: 2
    },
    {
      id: '2',
      name: 'Kiran Anna Coding Club',
      avatar: '/placeholder.svg',
      lastMessage: 'Executive Meeting today at 5 PM',
      timestamp: 'Yesterday',
      unread: 1
    }
  ])
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !selectedChat) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    }

    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMessage]
    }))
    setInput('')
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedChat) {
      // Handle file upload here
      console.log('File selected:', file.name)
    }
  }

  return (
    <div className="flex h-full">
      {/* Chat List */}
      <div className={`w-80 border-r ${selectedChat ? 'hidden md:block' : ''}`}>
        <div className="p-4 border-b bg-background">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Chats</h2>
            <Button variant="ghost" size="icon" aria-label="Menu">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-10"
              aria-label="Search chats"
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]" role="listbox" aria-label="Chat contacts">
          {contacts.map(contact => (
            <div
              key={contact.id}
              className={`p-4 hover:bg-muted cursor-pointer ${
                selectedChat === contact.id ? 'bg-muted' : ''
              }`}
              onClick={() => setSelectedChat(contact.id)}
              role="option"
              aria-selected={selectedChat === contact.id}
              tabIndex={0}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread && (
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {contact.unread}
                  </span>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col h-full">
          <div className="p-4 border-b flex items-center gap-3 bg-background">
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden"
              onClick={() => setSelectedChat(null)}
              aria-label="Back to chat list"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage 
                src={contacts.find(c => c.id === selectedChat)?.avatar} 
                alt={contacts.find(c => c.id === selectedChat)?.name || ''} 
              />
              <AvatarFallback>{contacts.find(c => c.id === selectedChat)?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="font-medium">{contacts.find(c => c.id === selectedChat)?.name}</h2>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Search in chat">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {(messages[selectedChat] || []).map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-70">{message.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-background">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                aria-label="Upload file"
                accept="image/*,application/pdf"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => fileInputRef.current?.click()}
                aria-label="Attach file"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Add image">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Add emoji">
                <Smile className="h-5 w-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                aria-label="Message input"
              />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={sendMessage}
                disabled={!input.trim()}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Welcome to Vicharcha Chat</h2>
            <p className="text-muted-foreground">Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </div>
  )
}