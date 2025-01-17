"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'other';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  attachments?: MessageAttachment[];
  repliedTo?: string;
}

interface MessageAttachment {
  type: 'image' | 'file' | 'voice';
  url: string;
  name: string;
  size?: number;
  duration?: number;
}

interface ChatMessages {
  [chatId: string]: Message[];
}

export function ChatInterface() {
  const [messages /*, setMessages*/ ] = useState<ChatMessages>({ default: [] });
  const [selectedChat] = useState<string>('default');
  const [isTyping] = useState(false);

  return (
    <div className="flex h-full">
      {/* ...existing code... */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {(messages[selectedChat] || []).map((message: Message, index: number) => {
            const isFirstInGroup = index === 0 || 
              messages[selectedChat][index - 1].sender !== message.sender;
            const isLastInGroup = index === messages[selectedChat].length - 1 || 
              messages[selectedChat][index + 1].sender !== message.sender;

            return (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`group relative max-w-[70%] ${
                  !isLastInGroup ? 'mb-1' : 'mb-4'
                }`}>
                  {message.repliedTo && (
                    <div className="text-xs text-muted-foreground mb-1 px-3">
                      Replying to {messages[selectedChat].find(m => m.id === message.repliedTo)?.content}
                    </div>
                  )}
                  <div className={cn(
                    "p-3 rounded-lg",
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted',
                    isFirstInGroup && message.sender === 'user' && 'rounded-tr-none',
                    isFirstInGroup && message.sender !== 'user' && 'rounded-tl-none'
                  )}>
                    {message.attachments?.map((attachment: MessageAttachment, i: number) => (
                      <div key={i} className="mb-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={attachment.url} 
                          alt={attachment.name}
                          className="rounded-lg max-w-full"
                        />
                      </div>
                    ))}
                    <p className="text-sm">{message.content}</p>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {message.reactions.map((reaction: MessageReaction, i: number) => (
                          <span key={i} className="text-xs bg-background/50 rounded-full px-2 py-1">
                            {reaction.emoji} {reaction.count}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1 text-xs opacity-70">
                      <span>{message.timestamp}</span>
                      {message.sender === 'user' && (
                        <span>{message.status === 'read' ? '✓✓' : '✓'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex gap-2 items-end">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      {/* ...existing code... */}
    </div>
  );
}
