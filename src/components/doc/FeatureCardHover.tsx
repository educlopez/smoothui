"use client"

import { useState } from "react"
import { motion } from "motion/react"

import { BodyText } from "@/components/doc/BodyText"
import { Title } from "@/components/doc/Title"

interface FeatureCardHoverProps {
  title: string
  description: string
  gradient: string
}

export function FeatureCardHover({
  title,
  description,
  gradient,
}: FeatureCardHoverProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`group r bg-primary inset-ring-background relative h-32 cursor-default overflow-hidden rounded-lg border bg-gradient-to-br inset-ring-2 ${gradient} p-4`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        willChange: "transform",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          y: isHovered ? -20 : 0,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <Title level={3} className="text-center font-semibold text-white">
          {title}
        </Title>
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center px-4"
        initial={{
          y: 20,
          opacity: 0,
          filter: "blur(8px)",
        }}
        animate={{
          y: isHovered ? 0 : 20,
          opacity: isHovered ? 1 : 0,
          filter: isHovered ? "blur(0px)" : "blur(8px)",
        }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <BodyText className="text-center text-sm font-semibold text-white">
          {description}
        </BodyText>
      </motion.div>
    </motion.div>
  )
}
