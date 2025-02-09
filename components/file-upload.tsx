"use client"

import { useState, useRef } from "react"
import { Upload, Image as ImageIcon, Music, Video, X, Check, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert } from "@/components/ui/alert"

interface FileUploadProps {
  onFileSelect?: (file: File) => void
  maxSize?: number // in MB
  allowedTypes?: {
    image?: boolean
    video?: boolean
    audio?: boolean
  }
}

export function FileUpload({ 
  onFileSelect, 
  maxSize = 100, 
  allowedTypes = { image: true, video: true, audio: true } 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Array<{ file: string, error: string }>>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const allowedMimeTypes = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    video: ['video/mp4', 'video/webm', 'video/quicktime'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
  }

  const validateFile = (file: File) => {
    const validTypes = [
      ...(allowedTypes.image ? allowedMimeTypes.image : []),
      ...(allowedTypes.video ? allowedMimeTypes.video : []),
      ...(allowedTypes.audio ? allowedMimeTypes.audio : [])
    ]

    if (!validTypes.includes(file.type)) {
      return "File type not supported"
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `File size too large (max ${maxSize}MB)`
    }
    return null
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = (newFiles: File[]) => {
    const newErrors: Array<{ file: string, error: string }> = []
    const validFiles = newFiles.filter(file => {
      const error = validateFile(file)
      if (error) {
        newErrors.push({ file: file.name, error })
        return false
      }
      return true
    })

    setErrors(newErrors)
    
    validFiles.forEach(file => {
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }))
      simulateUpload(file.name)
      if (onFileSelect) {
        onFileSelect(file)
      }
    })

    setFiles(prev => [...prev, ...validFiles])
  }

  const simulateUpload = (fileName: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress > 100) {
        progress = 100
        clearInterval(interval)
      }
      setUploadProgress(prev => ({
        ...prev,
        [fileName]: Math.min(progress, 100)
      }))
    }, 500)
  }

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[fileName]
      return newProgress
    })
  }

  const getFileIcon = (fileType: string) => {
    if (allowedMimeTypes.image.includes(fileType)) return <ImageIcon className="h-5 w-5" />
    if (allowedMimeTypes.video.includes(fileType)) return <Video className="h-5 w-5" />
    if (allowedMimeTypes.audio.includes(fileType)) return <Music className="h-5 w-5" />
    return null
  }

  return (
    <div className="w-full space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={[
            ...(allowedTypes.image ? ['.jpg', '.jpeg', '.png', '.gif', '.webp'] : []),
            ...(allowedTypes.video ? ['.mp4', '.webm', '.mov'] : []),
            ...(allowedTypes.audio ? ['.mp3', '.wav', '.ogg'] : [])
          ].join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Drag & drop your files here</h3>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse (up to {maxSize}MB)
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {allowedTypes.image && (
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" /> Images
              </div>
            )}
            {allowedTypes.video && (
              <div className="flex items-center">
                <Video className="h-4 w-4 mr-1" /> Videos
              </div>
            )}
            {allowedTypes.audio && (
              <div className="flex items-center">
                <Music className="h-4 w-4 mr-1" /> Audio
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {errors.map(({ file, error }, index) => (
          <motion.div
            key={`error-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <div className="ml-2">
                {file}: {error}
              </div>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="space-y-2">
        <AnimatePresence>
          {files.map((file) => (
            <motion.div
              key={file.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
            >
              <div className="p-2 bg-background rounded-md">
                {getFileIcon(file.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <div className="flex items-center gap-2">
                    {uploadProgress[file.name] === 100 ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(uploadProgress[file.name] || 0)}%
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeFile(file.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Progress value={uploadProgress[file.name] || 0} className="h-1" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
