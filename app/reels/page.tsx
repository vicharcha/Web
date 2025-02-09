"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { SidebarReels } from "@/components/sidebar-reels"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Film, Plus } from "lucide-react"
import { motion } from "framer-motion"

export default function ReelsPage() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const handleFileSelect = (file: File) => {
    // Here we would typically handle the file upload to our backend
    console.log('Selected file:', file)
    // Close the dialog after successful upload
    setIsUploadOpen(false)
  }

  return (
    <div className="container py-6 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Film className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Reels</h1>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 text-white hover:opacity-90">
              <Plus className="h-5 w-5" />
              Create Reel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New Reel</DialogTitle>
            </DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FileUpload 
                onFileSelect={handleFileSelect} 
                maxSize={100} 
                allowedTypes={{ video: true }}
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-violet-500/10 rounded-xl blur-xl" />
        <div className="relative">
          <SidebarReels />
        </div>
      </div>
    </div>
  )
}
