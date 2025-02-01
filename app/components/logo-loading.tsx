"use client"

import { motion } from "framer-motion"

export function LogoLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1.2, 1],
          opacity: [0, 1, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className="relative w-16 h-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-violet-600 rounded-lg transform rotate-45" />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl">V</div>
      </motion.div>
    </div>
  )
}

