"use client"

import type React from "react"
import { motion } from "framer-motion"

interface LoadingDotsProps {
  color?: string
  size?: number
  speed?: number
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ color = "currentColor", size = 4, speed = 0.7 }) => {
  return (
    <div className="flex items-center justify-center space-x-2" role="status" aria-label="Loading">
      {[...Array(3)].map((_, index) => (
        <motion.div
          key={index}
          className="rounded-full"
          style={{
            backgroundColor: color,
            width: size,
            height: size,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: speed,
            repeat: Number.POSITIVE_INFINITY,
            delay: index * 0.2,
          }}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}

