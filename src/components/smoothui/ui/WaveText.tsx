import React from "react"
import { motion } from "motion/react"

interface WaveTextProps {
  children: string
  amplitude?: number
  speed?: number
  className?: string
}

const WaveText: React.FC<WaveTextProps> = ({
  children,
  amplitude = 8,
  speed = 0.3,
  className = "",
}) => {
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {children.split("").map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          animate={{ y: [0, -amplitude, 0] }}
          transition={{
            repeat: Infinity,
            duration: speed * children.length,
            delay: i * speed,
            ease: "easeInOut",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  )
}

export default WaveText
