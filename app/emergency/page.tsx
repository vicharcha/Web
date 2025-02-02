"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Phone,
  AlertTriangle,
  MapPin,
  Ambulance,
  BadgeIcon as Police,
  Flame,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function EmergencyPage() {
  const [showMap, setShowMap] = useState(true)

  const services = [
    {
      title: "Medical Services",
      icon: Ambulance,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      distance: "2.3 miles",
      units: 3,
      action: "Request Ambulance",
      emergency: "102",
    },
    {
      title: "Fire Services",
      icon: Flame,
      color: "text-red-500",
      bgColor: "bg-red-50",
      distance: "1.8 miles",
      units: 2,
      action: "Request Fire Service",
      emergency: "101",
    },
    {
      title: "Police Services",
      icon: Police,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      distance: "1.5 miles",
      units: 4,
      action: "Request Police",
      emergency: "100",
    },
  ]

  const recentActivity = [
    {
      time: "10:45 AM",
      event: "System Check Complete",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      time: "10:30 AM",
      event: "Location Updated",
      icon: MapPin,
      color: "text-blue-500",
    },
    {
      time: "10:15 AM",
      event: "Connection Verified",
      icon: CheckCircle2,
      color: "text-green-500",
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold">Emergency Response Dashboard</h1>
        </div>
        <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600">
          All Clear
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">
                <div className="flex items-center gap-2">
                  <service.icon className={`h-5 w-5 ${service.color}`} />
                  {service.title}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Nearest Location:</span>
                    <span className="font-medium">{service.distance}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Available Units:</span>
                    <Badge variant="secondary">{service.units}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" variant="default">
                    {service.action}
                  </Button>
                  <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                    <Phone className="h-4 w-4" />
                    {service.emergency}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Emergency Response Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video rounded-lg border bg-muted">
              {/* Replace with actual map implementation */}
              <div className="h-full w-full bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Model Status</span>
                  <Badge variant="destructive">Error: Failed to initialize stations</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {"< 5 min"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Real-time monitoring</span>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.event}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Emergency Call</Button>
        </CardContent>
      </Card>
    </div>
  )
}

