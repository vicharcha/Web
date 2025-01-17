"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Phone, Video, VoicemailIcon as VoiceMail, Clock, Search } from 'lucide-react'

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

  const filteredCalls = recentCalls.filter(call =>
    call.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Calls</h1>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search calls..."
          className="pl-9 pr-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="voicemail">Voicemail</TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>Your call history</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {filteredCalls.map(call => (
                  <li key={call.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={call.avatar} alt={call.name} />
                        <AvatarFallback>{call.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{call.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          {call.type === 'audio' && <Phone className="h-4 w-4 mr-1" />}
                          {call.type === 'video' && <Video className="h-4 w-4 mr-1" />}
                          {call.type === 'missed' && <Phone className="h-4 w-4 mr-1 text-red-500" />}
                          <span>{call.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {call.duration && (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          {call.duration}
                        </Badge>
                      )}
                      <Button size="icon" variant="ghost">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost">
                        <Video className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contacts">
          {/* Add content for contacts tab */}
        </TabsContent>
        <TabsContent value="voicemail">
          {/* Add content for voicemail tab */}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Quick Call</CardTitle>
          <CardDescription>Start a new call</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Enter name or number" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-[48%]">
            <Phone className="mr-2 h-4 w-4" /> Audio Call
          </Button>
          <Button className="w-[48%]">
            <Video className="mr-2 h-4 w-4" /> Video Call
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

