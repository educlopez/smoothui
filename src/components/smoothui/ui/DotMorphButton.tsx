"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"

interface DotMorphButtonProps {
  label: string
  className?: string
  onClick?: () => void
}

export function DotMorphButton({
  label,
  className = "",
  onClick,
}: DotMorphButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      type="button"
      className={`bg-background flex items-center gap-3 rounded-full border ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.span
        className="flex items-center justify-center"
        initial={false}
        animate={
          isHovered
            ? {
                width: 12,
                height: 28,
                borderRadius: 999,
              }
            : {
                width: 16,
                height: 16,
                borderRadius: 999,
              }
        }
        transition={{
          type: "spring",
          stiffness: 600,
          damping: 22,
        }}
        style={{
          background: "var(--color-brand)",
          display: "inline-block",
        }}
      />
      <span className="text-foreground text-2xl font-medium select-none">
        {label}
      </span>
    </Button>
  )
}

export default DotMorphButton
