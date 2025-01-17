"use client"

import { useState } from 'react'
import { MessageCircle, Users, Sparkles, Ambulance, CreditCard, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import { BottomNavItem } from './bottom-nav-item'

const navItems = [
  { id: 'chat', icon: MessageCircle, label: 'Chat', href: '/chat' },
  { id: 'socialconnections', icon: Users, label: 'Social', href: '/social' },
  { id: 'ai', icon: Sparkles, label: 'AI', href: '/ai' },
  { id: 'emergency', icon: Ambulance, label: 'Emergency', href: '/emergency' },
  { id: 'payments', icon: CreditCard, label: 'Payments', href: '/payments' },
  { id: 'calls', icon: Phone, label: 'Calls', href: '/calls' },
]

export function BottomNav() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <motion.div 
      className="md:hidden sticky bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-background/80 backdrop-blur-xl border-t border-border/50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="flex justify-between p-2 max-w-2xl mx-auto">
        {navItems.map((item) => (
          <BottomNavItem
            key={item.id}
            {...item}
            isActive={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>
    </motion.div>
  )
}

