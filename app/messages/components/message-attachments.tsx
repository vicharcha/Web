"use client"

import { Button } from "@/components/ui/button"
import { Camera, File, Image, Paperclip, VoteIcon as Poll, Smile, Sticker, UserPlus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

export function MessageAttachments() {
  const attachmentOptions = [
    { icon: File, label: "Document" },
    { icon: Image, label: "Photos & Videos" },
    { icon: Camera, label: "Camera" },
    { icon: UserPlus, label: "Contact" },
    { icon: Poll, label: "Poll" },
    { icon: Sticker, label: "New Sticker" },
  ]

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-full p-0">
          <Tabs defaultValue="emoji">
            <TabsList className="w-full">
              <TabsTrigger value="emoji">Emoji</TabsTrigger>
              <TabsTrigger value="stickers">Stickers</TabsTrigger>
              <TabsTrigger value="gifs">GIFs</TabsTrigger>
            </TabsList>
            <TabsContent value="emoji" className="p-0">
              <Picker
                data={data}
                onEmojiSelect={console.log}
                theme={document.documentElement.classList.contains("dark") ? "dark" : "light"}
                set="native"
              />
            </TabsContent>
            <TabsContent value="stickers">
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-4 gap-2 p-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-lg bg-muted/50" />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="gifs">
              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-video rounded-lg bg-muted/50" />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-56">
          <div className="grid gap-1">
            {attachmentOptions.map((option) => (
              <Button key={option.label} variant="ghost" className="justify-start gap-2">
                <option.icon className="h-4 w-4" />
                {option.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

