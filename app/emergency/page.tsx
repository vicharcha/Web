"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { Ambulance, Phone, BadgeIcon as Police, FlameIcon as Fire } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface EmergencyContact {
  id: string
  name: string
  role: string
  contact: string
  avatar?: string
}

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([])

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-red-600">
        <h1 className="text-xl font-semibold text-white">Emergency Contacts</h1>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {contacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between bg-muted p-3 rounded-lg shadow
                           mobile-content tablet-content computer-half-content computer-full-content desktop-content"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={`${contact.name}'s avatar`} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{contact.name}</h2>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                  </div>
                </div>
                <Button variant="default" size="icon">
                  <Phone className="h-5 w-5 text-white" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="p-4">
        <Button variant="destructive" size="lg" className="w-full flex items-center justify-center gap-2">
          <Ambulance className="h-5 w-5" />
          <span>Call Emergency Services</span>
        </Button>
      </div>
    </div>
  )
}
