"use client"

import { Button } from "@/components/ui/button"
import { Camera, File, Image, Paperclip, Sticker, GiftIcon as Gif } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"

export function MessageAttachments() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // Here you would typically upload the file to your server
      console.log("File selected:", file.name)
    }
  }

  const attachmentOptions = [
    { icon: File, label: "Document", accept: ".pdf,.doc,.docx,.txt" },
    { icon: Image, label: "Photos & Videos", accept: "image/*,video/*" },
    { icon: Camera, label: "Camera", accept: "image/*,video/*" },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-80">
        <Tabs defaultValue="attachments">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="gifs">GIFs</TabsTrigger>
            <TabsTrigger value="stickers">Stickers</TabsTrigger>
          </TabsList>
          <TabsContent value="attachments">
            <div className="grid gap-2">
              {attachmentOptions.map((option) => (
                <Button
                  key={option.label}
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => document.getElementById(`file-upload-${option.label}`)?.click()}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                  <input
                    id={`file-upload-${option.label}`}
                    type="file"
                    accept={option.accept}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Button>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="gifs">
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-2 gap-2 p-2">
                {/* Replace with actual GIF data */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <Gif className="h-8 w-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="stickers">
            <ScrollArea className="h-[300px]">
              <div className="grid grid-cols-3 gap-2 p-2">
                {/* Replace with actual sticker data */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-md flex items-center justify-center">
                    <Sticker className="h-8 w-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

