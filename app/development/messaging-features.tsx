"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card"
import { Badge } from "components/ui/badge"
import { Progress } from "components/ui/progress"

export function MessagingFeaturesDevelopment() {
  const features = [
    { name: "Group Chats", status: "Completed", progress: 100 },
    { name: "Video/Voice Calls", status: "In Progress", progress: 80 },
    { name: "Advanced Search", status: "In Progress", progress: 60 },
    { name: "Profile Information", status: "Completed", progress: 100 },
    { name: "Media Gallery", status: "Completed", progress: 100 },
    { name: "Contact Blocking", status: "In Testing", progress: 90 },
    { name: "File Attachments", status: "Completed", progress: 100 },
    { name: "Emoji Picker", status: "Completed", progress: 100 },
    { name: "GIF Support", status: "In Progress", progress: 70 },
    { name: "Sticker Support", status: "Planned", progress: 20 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messaging Features Development</CardTitle>
        <CardDescription>Current status of messaging feature development</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {features.map((feature) => (
            <div key={feature.name} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{feature.name}</p>
                <Badge
                  variant={
                    feature.status === "Completed"
                      ? "default"
                      : feature.status === "In Progress"
                        ? "secondary"
                        : feature.status === "In Testing"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {feature.status}
                </Badge>
              </div>
              <Progress value={feature.progress} className="w-1/3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

