import React, { useRef, useState } from "react"

interface ScrambleHoverProps {
  children: string
  duration?: number // total animation duration in ms
  speed?: number // interval between scrambles in ms
  className?: string
}

const CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=<>?".split(
    ""
  )

function scrambleText(original: string) {
  return original
    .split("")
    .map((char) =>
      char === " "
        ? " "
        : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]
    )
    .join("")
}

const ScrambleHover: React.FC<ScrambleHoverProps> = ({
  children,
  duration = 600,
  speed = 30,
  className = "",
}) => {
  const [display, setDisplay] = useState(children)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    let elapsed = 0
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    intervalRef.current = setInterval(() => {
      setDisplay((prev) => scrambleText(children))
      elapsed += speed
    }, speed)
    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setDisplay(children)
    }, duration)
  }

  const handleMouseLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setDisplay(children)
  }

  return (
    <span
      className={className}
      style={{ cursor: "pointer", display: "inline-block" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {display}
    </span>
  )
}

export default ScrambleHover
