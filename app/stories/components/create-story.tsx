"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, Film, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function CreateStory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Maximum 10 files allowed",
      });
      return;
    }
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to create a story",
      });
      return;
    }

    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select at least one file",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('userId', user.phoneNumber);

      const response = await fetch('/api/stories/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create story');
      }

      toast({
        title: "Success",
        description: "Story created successfully",
      });
      setIsOpen(false);
      setFiles([]);
    } catch (error) {
      console.error('Error creating story:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create story",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          className="flex flex-col items-center gap-1 focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="p-[2px] rounded-full bg-primary">
            <div className="p-[2px] bg-background rounded-full">
              <div className="h-14 w-14 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
            </div>
          </div>
          <span className="text-xs truncate w-16 text-center">Add Story</span>
        </motion.button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Story</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {files.map((file, index) => (
              <motion.div
                key={index}
                className="relative aspect-square"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                    <Film className="h-6 w-6" />
                  </div>
                )}
                <button
                  className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-xs"
                  onClick={() => setFiles(prev => prev.filter((_, i) => i !== index))}
                >
                  ×
                </button>
              </motion.div>
            ))}
            {files.length < 10 && (
              <label className={cn(
                "cursor-pointer flex items-center justify-center bg-muted rounded-lg aspect-square",
                "hover:bg-muted/80 transition-colors"
              )}>
                <Input
                  type="file"
                  accept="image/*, video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Plus className="h-6 w-6" />
              </label>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading ? "Creating..." : "Create Story"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
