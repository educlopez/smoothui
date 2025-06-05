"use client"

import { RefObject, useRef, useState } from "react"
import { Power } from "lucide-react"
import {
  motion,
  useAnimation,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "motion/react"

export interface PowerOffSlideProps {
  onPowerOff?: () => void
  label?: string
  className?: string
  duration?: number
  disabled?: boolean
}

export default function PowerOffSlide({
  onPowerOff,
  label = "Slide to power off",
  className = "",
  duration = 2000,
  disabled = false,
}: PowerOffSlideProps) {
  const [isPoweringOff, setIsPoweringOff] = useState(false)
  const x = useMotionValue(0)
  const controls = useAnimation()
  const constraintsRef = useRef(null)
  const textRef: RefObject<HTMLDivElement | null> = useRef(null)

  const xInput = [0, 164]
  const opacityOutput = [0, 1]
  const opacity = useTransform(x, xInput, opacityOutput)

  useAnimationFrame((t) => {
    const animDuration = duration
    const progress = (t % animDuration) / animDuration
    if (textRef.current) {
      textRef.current.style.setProperty("--x", `${(1 - progress) * 100}%`)
    }
  })

  const handleDragEnd = async () => {
    if (disabled) return
    const dragDistance = x.get()
    if (dragDistance > 160) {
      await controls.start({ x: 168 })
      setIsPoweringOff(true)
      if (onPowerOff) onPowerOff()
      setTimeout(() => {
        setIsPoweringOff(false)
        controls.start({ x: 0 })
        x.set(0)
      }, duration)
    } else {
      controls.start({ x: 0 })
    }
  }

  return (
    <div className={`flex h-auto items-center justify-center ${className}`}>
      <div className="w-56">
        {isPoweringOff ? (
          <div className="text-foreground text-center">
            <p className="mb-2 text-xl font-light">Shutting down...</p>
          </div>
        ) : (
          <div
            ref={constraintsRef}
            className="bg-secondary relative h-14 overflow-hidden rounded-full border"
          >
            <div className="absolute inset-0 left-8 z-0 flex items-center justify-center overflow-hidden">
              <div className="text-md loading-shimmer text-foreground relative w-full text-center font-normal select-none">
                {label}
              </div>
            </div>
            <motion.div
              drag={disabled ? false : "x"}
              dragConstraints={{ left: 0, right: 168 }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              animate={controls}
              style={{ x }}
              className={`bg-background absolute top-1 left-1 z-10 flex h-12 w-12 items-center justify-center rounded-full shadow-md ${disabled ? "cursor-not-allowed opacity-50" : "cursor-grab active:cursor-grabbing"}`}
              tabIndex={disabled ? -1 : 0}
              aria-disabled={disabled}
            >
              <Power size={32} className="text-red-600" />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
