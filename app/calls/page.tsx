"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Video, Search, MoreVertical } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'

type Call = {
  id: string
  name: string
  avatar: string
  type: 'audio' | 'video' | 'missed'
  date: string
  duration?: string
}

const recentCalls: Call[] = [
  { id: '1', name: 'Priya Sharma', avatar: '/placeholder.svg?1', type: 'audio', date: '2023-05-15 14:30', duration: '5:23' },
  { id: '2', name: 'Rahul Patel', avatar: '/placeholder.svg?2', type: 'video', date: '2023-05-14 10:15', duration: '15:47' },
  { id: '3', name: 'Anita Desai', avatar: '/placeholder.svg?3', type: 'missed', date: '2023-05-13 18:45' },
  // Add more call records as needed
]

export default function CallsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [calls] = useState<Call[]>(recentCalls)

  const filteredCalls = calls.filter(call =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500">
        <h1 className="text-xl font-semibold text-white">Recent Calls</h1>
      </div>
      <div className="relative p-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search calls..."
          className="pl-9 pr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {filteredCalls.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between bg-muted p-3 rounded-lg shadow"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={call.avatar} />
                    <AvatarFallback>{call.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">{call.name}</h2>
                    <p className="text-sm text-muted-foreground">{call.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}
