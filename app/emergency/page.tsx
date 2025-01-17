"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Ambulance, Phone, Hospital, BadgeIcon as Police, FlameIcon as Fire } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'

const emergencyContacts = [
  { id: '1', name: 'Ambulance', number: '102', icon: Ambulance },
  { id: '2', name: 'Police', number: '100', icon: Police },
  { id: '3', name: 'Fire', number: '101', icon: Fire },
]

const nearbyHospitals = [
  { id: '1', name: 'City Hospital', distance: '2.5 km', phone: '1234567890' },
  { id: '2', name: 'General Medical Center', distance: '3.8 km', phone: '9876543210' },
  { id: '3', name: 'LifeCare Hospital', distance: '5.1 km', phone: '5555555555' },
]

export default function EmergencyPage() {
  const [location, setLocation] = useState('')

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Emergency Services</h1>

      <Card className="bg-red-100 dark:bg-red-900">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-100">Emergency Helpline</CardTitle>
          <CardDescription className="text-red-600 dark:text-red-200">Call 112 for immediate assistance</CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white">
            <Phone className="mr-2 h-4 w-4" /> Call 112
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="contacts">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="hospitals">Nearby Hospitals</TabsTrigger>
        </TabsList>
        <TabsContent value="contacts">
          <ScrollArea className="h-[300px]">
            <div className="grid gap-4 md:grid-cols-3">
              {emergencyContacts.map(contact => (
                <motion.div 
                  key={contact.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <contact.icon className="h-5 w-5" />
                        {contact.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{contact.number}</p>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">
                        <Phone className="mr-2 h-4 w-4" /> Call
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="hospitals">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <Button>Find Hospitals</Button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="grid gap-4 md:grid-cols-2">
                {nearbyHospitals.map(hospital => (
                  <motion.div 
                    key={hospital.id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Hospital className="h-5 w-5" />
                          {hospital.name}
                        </CardTitle>
                        <CardDescription>
                          <Badge variant="secondary">{hospital.distance}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-medium">{hospital.phone}</p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          <Phone className="mr-2 h-4 w-4" /> Call
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
