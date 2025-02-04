"use client"

import { cn } from "lib/utils"
import { motion } from "framer-motion"

interface LogoProps {
  className?: string
  variant?: "default" | "small" | "icon"
  animated?: boolean
}

export function Logo({ className, variant = "default", animated = false }: LogoProps) {
  const LogoContent = animated ? motion.div : "div"

  const iconVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 45,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  }

  const textVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  if (variant === "icon") {
    return (
      <LogoContent
        className={cn(
          "relative w-10 h-10 cursor-pointer group",
          className
        )}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        variants={iconVariants}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
        
        {/* Main logo background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-xl transform rotate-45 group-hover:scale-105 transition-transform duration-300" />
        
        {/* Inner shadow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl transform rotate-45" />
        
        {/* Logo text */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl transform -rotate-45 group-hover:scale-110 transition-transform duration-300">
          V
        </div>
      </LogoContent>
    )
  }

  return (
    <LogoContent
      className={cn(
        "flex items-center gap-3",
        variant === "small" ? "text-lg" : "text-2xl",
        className
      )}
    >
      {/* Icon */}
      <motion.div
        className="relative w-10 h-10 cursor-pointer group"
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        variants={iconVariants}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
        
        {/* Main logo background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-xl transform rotate-45 group-hover:scale-105 transition-transform duration-300" />
        
        {/* Inner shadow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl transform rotate-45" />
        
        {/* Logo text */}
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl transform -rotate-45 group-hover:scale-110 transition-transform duration-300">
          V
        </div>
      </motion.div>

      {/* Text */}
      <motion.span
        className={cn(
          "font-bold relative",
          variant === "small" ? "text-2xl" : "text-3xl"
        )}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
        variants={textVariants}
      >
        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 bg-clip-text text-transparent">
          Vicharcha
        </span>
        {/* Text glow effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 bg-clip-text text-transparent blur-lg opacity-50">
          Vicharcha
        </span>
      </motion.span>
    </LogoContent>
  )
}

export default Logo
