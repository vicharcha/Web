"use client"

import { useState, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Smile, Send, Mic } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const recordingTimeoutRef = useRef<NodeJS.Timeout>()

  const startRecording = () => {
    setIsRecording(true)
    // Implement voice recording logic
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
    }
    // Implement stop recording logic
  }

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  return (
    <div className="p-4 border-t bg-white">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf,.doc,.docx"
        aria-label="Upload document"
      />
      <input
        type="file"
        id="media-upload"
        className="hidden"
        accept="image/*,video/*"
        aria-label="Upload media"
      />
      <input
        type="file"
        id="camera-upload"
        className="hidden"
        accept="image/*"
        aria-label="Take photo"
      />
      <div className="flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1"
        />
        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>
        {message.trim() ? (
          <Button 
            size="icon" 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleSend}
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
  )
}

