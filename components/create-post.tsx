import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ImageIcon,
  Video,
  Music,
  X,
  Sparkles,
  Globe,
  Lock,
  Users,
  Radio,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PenLine
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/app/components/auth-provider"
import { toast } from "sonner"

const CreatePost = () => {
  const [content, setContent] = useState("")
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<string | null>(null)
  const [visibility, setVisibility] = useState("public")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamSettings, setStreamSettings] = useState({
    video: true,
    audio: true
  })
  const [streamDuration, setStreamDuration] = useState(0)
  const [viewers, setViewers] = useState(0)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { user } = useAuth()

  const handleMediaUpload = (type: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : type === "video" ? "video/*" : "audio/*"
      fileInputRef.current.click()
    }
  }

const toggleStream = async () => {
  if (!isStreaming) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: streamSettings.video,
        audio: streamSettings.audio
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream as MediaStream
      }
      setIsStreaming(true)
      setViewers(Math.floor(Math.random() * 50))
      streamTimerRef.current = setInterval(() => {
        setStreamDuration(prev => prev + 1)
      }, 1000)
    } catch (error) {
      toast.error("Could not start stream. Please check your permissions.")
    }
  } else {
    const stream = videoRef.current?.srcObject as MediaStream | null
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current)
    }
    setStreamDuration(0)
    setViewers(0)
  }
}

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current)
      }
    }
  }, [])

  return (
    <Card className="w-full bg-background border-none shadow-none">
      <CardContent className="p-0">
        <div className="rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/90 shadow-sm border p-4">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`/placeholder.svg?text=${user?.name?.[0] || "U"}`} alt={user?.name || "User"} />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Start a tweet, try writing with AI"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[60px] resize-none border-none bg-transparent p-0 focus-visible:ring-0 text-lg placeholder:text-muted-foreground/60"
              />

              {isStreaming ? (
                <div className="relative rounded-2xl overflow-hidden bg-black/95 border border-slate-200/20">
                  <video ref={videoRef} autoPlay muted className="w-full h-64 object-cover" />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      size="sm"
                      variant={streamSettings.audio ? "default" : "secondary"}
                      onClick={() => setStreamSettings(prev => ({ ...prev, audio: !prev.audio }))}
                      className="rounded-full"
                    >
                      {streamSettings.audio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant={streamSettings.video ? "default" : "secondary"}
                      onClick={() => setStreamSettings(prev => ({ ...prev, video: !prev.video }))}
                      className="rounded-full"
                    >
                      {streamSettings.video ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ) : mediaPreview && (
                <div className="relative rounded-2xl overflow-hidden">
                  {mediaType === "image" && (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="max-h-[300px] w-full object-cover rounded-2xl"
                    />
                  )}
                  {mediaType === "video" && (
                    <video src={mediaPreview} className="max-h-[300px] w-full rounded-2xl" controls />
                  )}
                  {mediaType === "audio" && (
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl">
                      <audio src={mediaPreview} className="w-full" controls />
                    </div>
                  )}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 right-2 rounded-full bg-black/50 hover:bg-black/70"
                    onClick={() => {
                      setMediaPreview(null)
                      setMediaType(null)
                    }}
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <div className="flex -ml-2 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMediaUpload("image")}
                className="rounded-full h-9 w-9"
              >
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMediaUpload("video")}
                className="rounded-full h-9 w-9"
              >
                <Video className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMediaUpload("audio")}
                className="rounded-full h-9 w-9"
              >
                <Music className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleStream}
                className="rounded-full h-9 w-9"
              >
                <Radio className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-9 w-9"
              >
                <PenLine className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 rounded-full text-xs">
                    {visibility === "public" ? (
                      <Globe className="h-4 w-4" />
                    ) : visibility === "private" ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    Everyone
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => setVisibility("public")}>
                    <Globe className="h-4 w-4 mr-2" /> Everyone
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setVisibility("connections")}>
                    <Users className="h-4 w-4 mr-2" /> Connections Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setVisibility("private")}>
                    <Lock className="h-4 w-4 mr-2" /> Private
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                onClick={() => {
                  if (isStreaming) {
                    toggleStream()
                  }
                  toast.success("Post created successfully!")
                  setContent("")
                  setMediaPreview(null)
                  setMediaType(null)
                }}
                disabled={(!content.trim() && !mediaPreview && !isStreaming)}
                className="rounded-full px-6 bg-primary hover:bg-primary/90"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CreatePost
