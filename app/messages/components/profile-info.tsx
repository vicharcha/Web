"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Phone, Mail, MapPin, Link, FileText, Bell, BlocksIcon as Block } from "lucide-react"

interface ProfileInfoProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileInfo({ isOpen, onClose }: ProfileInfoProps) {
  const profile = {
    name: "John Doe",
    avatar: "/placeholder.svg?height=128&width=128",
        email: "john.doe@example.com",
    location: "New York, NY",
    website: "https://johndoe.com",
    bio: "Software developer passionate about creating amazing user experiences.",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Information</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-semibold">{profile.name}</h2>
            <div className="w-full space-y-4">
              <div className="flex items-center space-x-4">
                                              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link className="h-5 w-5 text-muted-foreground" />
                <a href={profile.website} className="text-primary hover:underline">
                  {profile.website}
                </a>
              </div>
              <div className="flex items-start space-x-4">
                <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                <p className="flex-1">{profile.bio}</p>
              </div>
            </div>
            <div className="w-full space-y-4 pt-4">
              <Button className="w-full" variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                Mute Notifications
              </Button>
              <Button className="w-full" variant="outline">
                <Block className="mr-2 h-4 w-4" />
                Block Contact
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
