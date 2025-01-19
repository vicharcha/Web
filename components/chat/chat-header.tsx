"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Phone, Settings, Menu, Video } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

interface ChatHeaderProps {
  chatId: string
  onOpenSidebar: () => void
}

export function ChatHeader({ chatId, onOpenSidebar }: ChatHeaderProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 border-b bg-white">
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
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <Link href="/">
          <Button variant="ghost" size="icon" className={pathname === '/' ? 'text-primary' : 'text-muted-foreground'}>
            <Home className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="/chat">
          <Button variant="ghost" size="icon" className={pathname === '/chat' ? 'text-primary' : 'text-muted-foreground'}>
            <MessageSquare className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="/calls">
          <Button variant="ghost" size="icon" className={pathname === '/calls' ? 'text-primary' : 'text-muted-foreground'}>
            <Phone className="h-5 w-5" />
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" size="icon" className={pathname === '/settings' ? 'text-primary' : 'text-muted-foreground'}>
            <Settings className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
