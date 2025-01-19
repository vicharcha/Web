"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Menu, Phone, Video } from 'lucide-react'

interface ChatHeaderProps {
  chatId: string
  onOpenSidebar: () => void
}

export function ChatHeader({ chatId, onOpenSidebar }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onOpenSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>
            {chatId[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{chatId}</h2>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

