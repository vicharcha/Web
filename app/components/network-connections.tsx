"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Sparkles, UserPlus, X } from "lucide-react"

interface Connection {
  id: string
  name: string
  avatar: string
  role: string
  company: string
  mutualConnections: number
  isPremium?: boolean
}

// Mock data for connections
const mockConnections: Connection[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?1",
    role: "Senior Software Engineer",
    company: "Tech Corp",
    mutualConnections: 15,
    isPremium: true
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?2",
    role: "Product Designer",
    company: "Design Studios",
    mutualConnections: 23
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "/placeholder.svg?3",
    role: "Frontend Developer",
    company: "Web Solutions",
    mutualConnections: 8,
    isPremium: true
  },
  {
    id: "4",
    name: "Alex Thompson",
    avatar: "/placeholder.svg?4",
    role: "UX Researcher",
    company: "UX Labs",
    mutualConnections: 12
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "/placeholder.svg?5",
    role: "Tech Lead",
    company: "Innovation Inc",
    mutualConnections: 19,
    isPremium: true
  }
]

export function NetworkConnections() {
  const [connections, setConnections] = useState(mockConnections)
  const [invitationsSent, setInvitationsSent] = useState<Set<string>>(new Set())

  const handleConnect = (connectionId: string) => {
    setInvitationsSent(prev => new Set([...prev, connectionId]))
  }

  const handleIgnore = (connectionId: string) => {
    setConnections(connections.filter(c => c.id !== connectionId))
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">People You May Know</h2>
        <Badge variant="secondary" className="text-sm">
          {connections.length} suggestions
        </Badge>
      </div>

      {/* Connections Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {connections.map((connection, index) => (
          <motion.div
            key={connection.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-violet-500/10 rounded-xl blur-xl" />
            <div className="relative p-6 rounded-xl border bg-card/50 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage src={connection.avatar} alt={connection.name} />
                  <AvatarFallback>{connection.name[0]}</AvatarFallback>
                </Avatar>
                {connection.isPremium && (
                  <div className="p-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="space-y-1 mb-4">
                <h3 className="font-semibold truncate">{connection.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{connection.role}</p>
                <p className="text-sm text-muted-foreground truncate">{connection.company}</p>
                <p className="text-sm text-muted-foreground">
                  {connection.mutualConnections} mutual connections
                </p>
              </div>

              <div className="flex gap-2">
                {invitationsSent.has(connection.id) ? (
                  <Button className="w-full" variant="secondary" disabled>
                    Invitation Sent
                  </Button>
                ) : (
                  <>
                    <Button 
                      className="flex-1 gap-2" 
                      onClick={() => handleConnect(connection.id)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Connect
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleIgnore(connection.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {connections.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No more suggestions at the moment.
        </div>
      )}
    </div>
  )
}
