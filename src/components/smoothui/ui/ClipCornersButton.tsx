"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"

interface ClipCornersButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function ClipCornersButton({
  children,
  className = "",
  onClick,
}: ClipCornersButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Distance triangles move on hover
  const move = -4

  return (
    <Button
      type="button"
      className={`bg-foreground text-background hover:bg-foreground/90 relative overflow-hidden rounded-none border-none px-8 py-4 font-mono text-2xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{ borderRadius: 8 }}
    >
      {/* Top-left triangle */}
      <motion.div
        className="absolute top-1.5 left-1.5"
        style={{ width: 8, height: 8 }}
        initial={false}
        animate={{
          x: isHovered ? -move : 0,
          y: isHovered ? -move : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      >
        <svg width="8" height="8">
          <polygon points="0,0 8,0 0,8" fill="white" />
        </svg>
      </motion.div>
      {/* Top-right triangle */}
      <motion.div
        className="absolute top-1.5 right-1.5"
        style={{ width: 8, height: 8 }}
        initial={false}
        animate={{
          x: isHovered ? move : 0,
          y: isHovered ? -move : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      >
        <svg width="8" height="8">
          <polygon points="8,0 8,8 0,0" fill="white" />
        </svg>
      </motion.div>
      {/* Bottom-left triangle */}
      <motion.div
        className="absolute bottom-1.5 left-1.5"
        style={{ width: 8, height: 8 }}
        initial={false}
        animate={{
          x: isHovered ? -move : 0,
          y: isHovered ? move : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      >
        <svg width="8" height="8">
          <polygon points="0,8 8,8 0,0" fill="white" />
        </svg>
      </motion.div>
      {/* Bottom-right triangle */}
      <motion.div
        className="absolute right-1.5 bottom-1.5"
        style={{ width: 8, height: 8 }}
        initial={false}
        animate={{
          x: isHovered ? move : 0,
          y: isHovered ? move : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      >
        <svg width="8" height="8">
          <polygon points="8,8 0,8 8,0" fill="white" />
        </svg>
      </motion.div>
      <span className="relative z-10 flex w-full items-center justify-center select-none">
        {children}
      </span>
    </Button>
  )
}

export default ClipCornersButton
