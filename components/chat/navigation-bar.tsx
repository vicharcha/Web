"use client"

import { Button } from "@/components/ui/button"
import { Home, MessageSquare, Phone, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function NavigationBar() {
  const pathname = usePathname()

  return (
    <div className="h-16 border-t bg-background flex items-center justify-around px-4">
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
  )
}

