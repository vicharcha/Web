"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, Ambulance, BadgeIcon as Police, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function EmergencyPage() {
  const services = [
    {
      title: "Medical Services",
      icon: Ambulance,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Fire Services",
      icon: Flame,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Police Services",
      icon: Police,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">Emergency Response Dashboard</h1>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          Coming Soon
        </Badge>
      </div>

      <Card className="border-2 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Emergency Services Platform Under Development
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {services.map((service) => (
                <div 
                  key={service.title} 
                  className={`${service.bgColor} rounded-lg p-4 flex items-center justify-center gap-2 opacity-50`}
                >
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                  <span className="font-medium">{service.title}</span>
                </div>
              ))}
            </div>
            
            <div className="max-w-lg mx-auto space-y-4">
              <p className="text-lg text-muted-foreground">
                We're building a comprehensive emergency response system to serve you better.
              </p>
              <div className="py-6">
                <div className="relative mx-auto w-24 h-24">
                  <div className="animate-ping absolute w-full h-full rounded-full bg-red-500/20"></div>
                  <div className="relative flex items-center justify-center w-full h-full rounded-full bg-red-500/30">
                    <AlertTriangle className="h-12 w-12 text-red-500" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                For emergencies, please continue to use your local emergency services numbers:
                <br />
                Police: 100 | Fire: 101 | Ambulance: 102
              </p>
            </div>

            <Button className="w-full max-w-md mx-auto" disabled>
              Platform Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}