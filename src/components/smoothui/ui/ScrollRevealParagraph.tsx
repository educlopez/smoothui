"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"

interface ScrollRevealParagraphProps {
  paragraph: string
  className?: string
}

export default function ScrollRevealParagraph({
  paragraph,
  className = "",
}: ScrollRevealParagraphProps) {
  const container = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.25"],
  })

  const words = paragraph.split(" ")

  return (
    <p ref={container} className={`text-lg leading-relaxed ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word
            key={`word-${i}-${word.slice(0, 3)}`}
            progress={scrollYProgress}
            range={[start, end]}
          >
            {word}
          </Word>
        )
      })}
    </p>
  )
}

interface WordProps {
  children: string
  progress: any
  range: [number, number]
}

const Word = ({ children, progress, range }: WordProps) => {
  const opacity = useTransform(progress, range, [0, 1])

  return (
    <span className="relative mr-2 inline-block">
      <span className="text-foreground/10">{children}</span>
      <motion.span
        className="text-foreground absolute inset-0"
        style={{ opacity }}
      >
        {children}
      </motion.span>
    </span>
  )
}
