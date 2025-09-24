"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/components/smoothui/utils/cn"

export interface PriceFlowProps {
  value: number
  className?: string
}

export default function PriceFlow({ value, className = "" }: PriceFlowProps) {
  const [prevValue, setPrevValue] = useState(value)

  // Create refs for each digit position (tens and ones)
  const prevTensRef = useRef<HTMLElement>(null)
  const nextTensRef = useRef<HTMLElement>(null)
  const prevOnesRef = useRef<HTMLElement>(null)
  const nextOnesRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (value !== prevValue) {
      const prevTens = prevTensRef.current
      const nextTens = nextTensRef.current
      const prevOnes = prevOnesRef.current
      const nextOnes = nextOnesRef.current

      // Animate tens digit if it changed
      if (
        prevTens &&
        nextTens &&
        Math.floor(value / 10) !== Math.floor(prevValue / 10)
      ) {
        const tensChanged =
          Math.floor(value / 10) !== Math.floor(prevValue / 10)

        if (tensChanged) {
          if (Math.floor(value / 10) > Math.floor(prevValue / 10)) {
            prevTens.classList.add("slide-out-up")
            nextTens.classList.add("slide-in-up")
          } else {
            prevTens.classList.add("slide-out-down")
            nextTens.classList.add("slide-in-down")
          }

          const handleTensAnimationEnd = () => {
            prevTens.classList.remove("slide-out-up", "slide-out-down")
            nextTens.classList.remove("slide-in-up", "slide-in-down")
            prevTens.removeEventListener("animationend", handleTensAnimationEnd)
          }

          prevTens.addEventListener("animationend", handleTensAnimationEnd)
        }
      }

      // Animate ones digit if it changed
      if (prevOnes && nextOnes && value % 10 !== prevValue % 10) {
        const onesChanged = value % 10 !== prevValue % 10

        if (onesChanged) {
          // Add a small delay for the ones digit to create staggered effect
          setTimeout(() => {
            if (value % 10 > prevValue % 10) {
              prevOnes.classList.add("slide-out-up")
              nextOnes.classList.add("slide-in-up")
            } else {
              prevOnes.classList.add("slide-out-down")
              nextOnes.classList.add("slide-in-down")
            }

            const handleOnesAnimationEnd = () => {
              prevOnes.classList.remove("slide-out-up", "slide-out-down")
              nextOnes.classList.remove("slide-in-up", "slide-in-down")
              prevOnes.removeEventListener(
                "animationend",
                handleOnesAnimationEnd
              )
            }

            prevOnes.addEventListener("animationend", handleOnesAnimationEnd)
          }, 50) // 50ms delay for staggered effect
        }
      }

      setPrevValue(value)
    }
  }, [value, prevValue])

  const formatValue = (val: number) => {
    return val.toString().padStart(2, "0")
  }

  const prevFormatted = formatValue(prevValue)
  const currentFormatted = formatValue(value)

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <span className="relative inline-block overflow-hidden">
        {/* Tens digit */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          ref={prevTensRef}
          style={{ transform: `translateY(-100%)` }}
        >
          {prevFormatted[0]}
        </span>
        <span
          className="flex items-center justify-center"
          ref={nextTensRef}
          style={{ transform: `translateY(0%)` }}
        >
          {currentFormatted[0]}
        </span>
      </span>

      <span className="relative inline-block overflow-hidden">
        {/* Ones digit */}
        <span
          className="absolute inset-0 flex items-center justify-center"
          ref={prevOnesRef}
          style={{ transform: `translateY(-100%)` }}
        >
          {prevFormatted[1]}
        </span>
        <span
          className="flex items-center justify-center"
          ref={nextOnesRef}
          style={{ transform: `translateY(0%)` }}
        >
          {currentFormatted[1]}
        </span>
      </span>
    </span>
  )
}
