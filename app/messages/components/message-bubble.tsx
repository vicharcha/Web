"use client"

import { motion } from "framer-motion"
import { Check, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageBubbleProps {
  sender: "you" | "them";
  content: string;
  time: string;
  status?: "sent" | "delivered" | "read";
  media?: {
    url: string;
    caption: string;
  };
  isLast?: boolean;
  onMediaClick?: () => void;
  isPremium?: boolean;
}

export function MessageBubble({
  sender,
  content,
  time,
  status = "sent",
  media,
  isLast,
  onMediaClick,
  isPremium
}: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex group",
        sender === "you" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-2xl max-w-[70%]",
          "transform transition-all duration-200 hover:scale-[1.02]",
          sender === "you" 
            ? cn(
                "bg-gradient-to-br",
                isPremium 
                  ? "from-amber-500 to-orange-600 text-white"
                  : "from-blue-600 to-blue-700 text-white",
                "shadow-lg hover:shadow-primary/20"
              )
            : "bg-accent shadow hover:shadow-accent/20"
        )}
      >
        {/* Media Content */}
        {media && (
          <div className="p-1">
            <motion.img
              src={media.url}
              alt={media.caption}
              className="rounded-lg max-h-[300px] w-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={onMediaClick}
              layoutId={`media-${media.url}`}
            />
            {media.caption && (
              <p className="text-sm opacity-70 px-2 py-1">{media.caption}</p>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="p-4">
          <p className="whitespace-pre-wrap break-words">{content}</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <p className="text-xs opacity-70">{time}</p>
            {sender === "you" && (
              <div className={cn(
                "flex text-xs",
                status === "read" ? "text-blue-300" : "opacity-70"
              )}>
                <Check className="h-3 w-3" />
                {(status === "delivered" || status === "read") && (
                  <Check className="h-3 w-3 -ml-1" />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reactions Hover Button - Future Feature */}
        <div className={cn(
          "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity",
          sender === "you" ? "-left-12" : "-right-12",
          "flex items-center justify-center"
        )}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-background/80 backdrop-blur-sm shadow hover:bg-background"
          >
            {/* Add reaction icon here */}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
