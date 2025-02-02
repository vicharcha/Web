"use client"

import { useState } from 'react'
import { Home, MessageCircle, Users, Sparkles, Ambulance, CreditCard, Phone, Search, ChevronLeft, Star, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import { SidebarItem } from './sidebar-item'

const navItems = [
  {
    id: 'quick',
    label: 'Quick Access',
    items: [
      { id: 'home', icon: Home, label: 'Home', href: '/' },
      { id: 'chat', icon: MessageCircle, label: 'Messages', href: '/chat', highlight: true },
      { id: 'calls', icon: Phone, label: 'Phone', href: '/calls', highlight: true }
    ]
  },
  {
    id: 'main',
    label: 'Main Menu',
    items: [
      { id: 'socialconnections', icon: Users, label: 'Social', href: '/social' },
      { id: 'ai', icon: Sparkles, label: 'AI Assistant', href: '/ai', badge: 'New' },
      { id: 'development', icon: Sparkles, label: 'Development', href: '/development', badge: 'Coming Soon' },
      { id: 'emergency', icon: Ambulance, label: 'Emergency', href: '/emergency', important: true, badge: 'Coming Soon' },
      { id: 'payments', icon: CreditCard, label: 'Payments', href: '/payments' },
      { id: 'shopping', icon: ShoppingCart, label: 'Shopping', href: '/shopping' }
    ]
  }
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "hidden md:flex flex-col h-screen border-r border-border/50 transition-all duration-300 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-xl",
      collapsed ? "w-16" : "w-80"
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between border-b border-border/50">
          {!collapsed && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-2 rounded-xl bg-primary/10">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-lg">Vicharcha</span>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-gray-100/5"
          >
            <ChevronLeft className={cn(
              "h-5 w-5 transition-transform duration-200",
              collapsed && "rotate-180"
            )} />
          </Button>
        </div>

        <div className="flex-1 flex flex-col gap-6 p-4">
          <AnimatePresence>
            {!collapsed && (
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9 bg-gray-100/5 border-gray-100/10 focus:border-primary/50 placeholder:text-muted-foreground/50 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              </motion.div>
            )}
          </AnimatePresence>

          <ScrollArea className="flex-1 -mx-4">
            <div className="px-4 space-y-6">
              {navItems.map((section) => (
                <div key={section.id} className="space-y-2">
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div 
                        className="px-3 mb-1"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-xs font-medium text-muted-foreground/70">
                          {section.label}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <SidebarItem
                        key={item.id}
                        item={item}
                        collapsed={collapsed}
                        isActive={pathname === item.href}
                        onClick={() => {}}
                        className="mobile-sidebar tablet-sidebar computer-half-sidebar computer-full-sidebar desktop-sidebar"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
