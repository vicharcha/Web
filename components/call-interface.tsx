"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, Volume1, VolumeX } from 'lucide-react'

interface CallInterfaceProps {
  type: 'audio' | 'video'
  contactName: string
  contactAvatar: string
  onEndCall: () => void
}

export function CallInterface({ type, contactName, contactAvatar, onEndCall }: CallInterfaceProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [volume, setVolume] = useState(2) // 0: muted, 1: low, 2: high
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-900 to-gray-700 text-white">
      <div className="text-center mb-8">
        <Avatar className="h-32 w-32 mb-4">
          <AvatarImage src={contactAvatar} alt={contactName} />
          <AvatarFallback>{contactName[0]}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{contactName}</h2>
        <p className="text-xl">{formatDuration(callDuration)}</p>
      </div>

      {type === 'video' && !isVideoOff && (
        <div className="bg-gray-800 w-full max-w-md h-64 mb-8 rounded-lg overflow-hidden">
          {/* Placeholder for video feed */}
        </div>
      )}

      <div className="flex gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-700 hover:bg-gray-600"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
        {type === 'video' && (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gray-700 hover:bg-gray-600"
            onClick={() => setIsVideoOff(!isVideoOff)}
          >
            {isVideoOff ? <VideoOff className="h-6 w-6" /> : <Video className="h-6 w-6" />}
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-700 hover:bg-gray-600"
          onClick={() => setVolume((prev) => (prev + 1) % 3)}
        >
          {volume === 0 && <VolumeX className="h-6 w-6" />}
          {volume === 1 && <Volume1 className="h-6 w-6" />}
          {volume === 2 && <Volume2 className="h-6 w-6" />}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          className="rounded-full"
          onClick={onEndCall}
        >
          <PhoneOff className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}

