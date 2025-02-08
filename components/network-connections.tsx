"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCheck, MessageSquare } from "lucide-react"

interface Connection {
  id: string
  name: string
  role: string
  avatar: string
  mutualConnections: number
  isOnline?: boolean
  phoneNumber?: string
}

interface NetworkConnectionsProps {
  connections: Connection[]
}

export function NetworkConnections({ connections = defaultConnections }: NetworkConnectionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Your Network</h2>
        <Button variant="ghost" className="text-primary">View All</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {connections.map((connection) => (
          <Card key={connection.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12 border-2 border-background">
                  <AvatarImage src={connection.avatar} alt={connection.name} />
                  <AvatarFallback>{connection.name[0]}</AvatarFallback>
                </Avatar>
                {connection.isOnline && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-500 border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{connection.name}</p>
                  <BadgeCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground">{connection.role}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {connection.mutualConnections} mutual connections
                </p>
                {connection.phoneNumber && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {connection.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button className="w-full gap-2" variant="secondary">
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
              <Button className="w-full" variant="outline">
                Connect
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

const defaultConnections: Connection[] = [
  {
    id: "1",
    name: "Alice Johnson",
    role: "Software Engineer",
    avatar: "/placeholder-user.jpg",
    mutualConnections: 12,
    isOnline: true
  },
  {
    id: "2",
    name: "Bob Smith",
    role: "Product Manager",
    avatar: "/placeholder-user.jpg",
    mutualConnections: 8
  },
  {
    id: "3",
    name: "Charlie Brown",
    role: "UX Designer",
    avatar: "/placeholder-user.jpg",
    mutualConnections: 15,
    phoneNumber: "+91 91828 83649",
    isOnline: true
  }
]
