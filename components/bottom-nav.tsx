"use client"

import { useState } from 'react'
import { MessageCircle, Activity, Sparkles, ShoppingBag, Users, Phone, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const [activeTab, setActiveTab] = useState('chat')

  const navItems = [
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'social connections', icon: Activity, label: 'Social Connections' },
    { id: 'shop', icon: ShoppingBag, label: 'Shop' },
    { id: 'ai', icon: Sparkles, label: 'AI' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'calls', icon: Phone, label: 'Calls' },
  ]

  return (
    <div className="md:hidden sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t">
      <div className="flex justify-between p-2">
        {navItems.map(({ id, icon: Icon, label }) => (
          <Button
            key={id}
            variant="ghost"
            size="icon"
            className={cn(
              "flex-col items-center text-xs relative group transition-colors duration-200",
              activeTab === id ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
            onClick={() => setActiveTab(id)}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="sr-only md:not-sr-only md:text-[10px]">{label}</span>
            {activeTab === id && (
              <span className="absolute -bottom-2 left-1/2 w-1 h-1 bg-primary rounded-full transform -translate-x-1/2" />
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}

