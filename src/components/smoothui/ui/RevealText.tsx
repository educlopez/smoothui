import React from "react"
import { motion, useInView } from "motion/react"

interface RevealTextProps {
  children: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  triggerOnView?: boolean
  className?: string
}

const directionVariants = {
  up: { y: 24, opacity: 0 },
  down: { y: -24, opacity: 0 },
  left: { x: 24, opacity: 0 },
  right: { x: -24, opacity: 0 },
}

const RevealText: React.FC<RevealTextProps> = ({
  children,
  direction = "up",
  delay = 0,
  triggerOnView = false,
  className = "",
}) => {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const animate = !triggerOnView || inView

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={directionVariants[direction]}
      animate={animate ? { x: 0, y: 0, opacity: 1 } : undefined}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.span>
  )
}

export default RevealText
