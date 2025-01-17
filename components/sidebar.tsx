"use client"

import { useState } from 'react'
import { MessageCircle, Activity, Sparkles, ShoppingBag, Users, Phone, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'social connection', icon: Activity, label: 'Social Connection' },
    { id: 'shop', icon: ShoppingBag, label: 'Shop' },
    { id: 'ai', icon: Sparkles, label: 'AI' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'groups', icon: Users, label: 'Groups' },
    { id: 'calls', icon: Phone, label: 'Calls' },
  ]

  return (
    <div className={cn(
      "hidden md:flex flex-col h-screen bg-background border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 flex justify-between items-center">
        {!collapsed && <h1 className="text-xl font-bold">Vicharcha</h1>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-2">
          <TooltipProvider delayDuration={0}>
            {navItems.map(({ id, icon: Icon, label }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      collapsed ? "px-2" : "px-4"
                    )}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {!collapsed && <span>{label}</span>}
                  </Button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </ScrollArea>
    </div>
  )
}

