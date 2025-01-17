"use client"

import { Home, MessageSquare, Phone, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navigationItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: MessageSquare, label: 'Chat', href: '/chat' },
  { icon: Phone, label: 'Calls', href: '/calls' },
  { icon: Settings, label: 'Settings', href: '/settings' }
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden">
      <nav className="flex items-center justify-around p-2 max-w-screen-xl mx-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="w-full">
              <Button
                variant="ghost"
                className={`w-full flex flex-col items-center gap-1 h-auto py-2 px-1
                  ${isActive ? 'text-primary' : 'text-muted-foreground'}
                  hover:text-primary hover:bg-transparent`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

