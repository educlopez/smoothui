"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

interface AnimatedNumberProps {
  value: number
  duration?: number // in ms
}

export default function AnimatedNumber({
  value,
  duration = 1000,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start: number | null = null
    let frame: number

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / duration, 1)
      setDisplayValue(Math.floor(progress * value))
      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      } else {
        setDisplayValue(value)
      }
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  // Format with K if needed
  const formatted =
    value > 999 ? (displayValue / 1000).toFixed(1) + "K" : displayValue

  return (
    <span className="hover:text-brand flex items-center gap-1 text-sm font-medium transition-colors">
      <Star className="size-4" />
      <span className="w-auto">{formatted}</span>
    </span>
  )
}
