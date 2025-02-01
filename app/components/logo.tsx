"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LogoProps {
  className?: string
  variant?: "default" | "small" | "icon"
  animated?: boolean
}

export function Logo({ className, variant = "default", animated = false }: LogoProps) {
  const LogoContent = animated ? motion.div : "div"

  if (variant === "icon") {
    return (
      <LogoContent
        className={cn("relative w-8 h-8", className)}
        initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg transform rotate-45" />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">V</div>
      </LogoContent>
    )
  }

  return (
    <LogoContent
      className={cn("flex items-center gap-2", variant === "small" ? "text-lg" : "text-2xl", className)}
      initial={animated ? { y: -20, opacity: 0 } : undefined}
      animate={animated ? { y: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg transform rotate-45" />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">V</div>
      </div>
      <span className="font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
        Vicharcha
      </span>
    </LogoContent>
  )
}

