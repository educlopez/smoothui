"use client"

import { RefObject, useRef, useState } from "react"
import {
  motion,
  useAnimation,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { Power } from "lucide-react"

export default function IosPoweroff() {
  const [isPoweringOff, setIsPoweringOff] = useState(false)
  const x = useMotionValue(0)
  const controls = useAnimation()
  const constraintsRef = useRef(null)
  const textRef: RefObject<HTMLDivElement> = useRef(null)

  const xInput = [0, 164]
  const opacityOutput = [0, 1]
  const opacity = useTransform(x, xInput, opacityOutput)

  useAnimationFrame((t) => {
    const duration = 2000
    const progress = (t % duration) / duration
    if (textRef.current) {
      textRef.current.style.setProperty("--x", `${(1 - progress) * 100}%`)
    }
  })

  const handleDragEnd = async () => {
    const dragDistance = x.get()
    if (dragDistance > 160) {
      await controls.start({ x: 168 })
      setIsPoweringOff(true)
      // Add a timeout to reset the component after 2 seconds
      setTimeout(() => {
        setIsPoweringOff(false)
        controls.start({ x: 0 })
        x.set(0)
      }, 2000)
    } else {
      controls.start({ x: 0 })
    }
  }

  return (
    <div className="flex h-auto items-center justify-center">
      <div className="w-56">
        {isPoweringOff ? (
          <div className="text-center text-light12 dark:text-dark12">
            <p className="mb-2 text-xl font-light">Shutting down...</p>
          </div>
        ) : (
          <div
            ref={constraintsRef}
            className="relative h-14 overflow-hidden rounded-full bg-light5 dark:bg-dark5"
          >
            <div className="absolute inset-0 left-8 z-0 flex items-center justify-center overflow-hidden">
              <div
                ref={textRef}
                className="text-md relative w-full select-none text-center font-normal text-light12 dark:invert"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, currentColor 0%, currentColor 45%, white 50%, currentColor 55%, currentColor 100%)",
                  backgroundSize: "200% 100%",
                  backgroundPosition: "var(--x, 100%) 0",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  transition: "none",
                }}
              >
                Slide to power off
              </div>
            </div>
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 168 }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
              animate={controls}
              style={{ x }}
              className="absolute left-1 top-1 z-10 flex h-12 w-12 cursor-grab items-center justify-center rounded-full bg-light1 shadow-md active:cursor-grabbing dark:bg-dark1"
            >
              <Power size={32} className="text-red-600" />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
