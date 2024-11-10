"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Minus, Plus } from "lucide-react"

const springTransition = {
  type: "spring",
  stiffness: 700,
  damping: 30,
  mass: 1,
}

const AnimatedDigit = ({
  value,
  prev,
  index,
  total,
}: {
  value: number
  prev: number
  index: number
  total: number
}) => {
  const increasing = value > prev

  return (
    <div className="relative h-16 w-12 overflow-hidden rounded-lg bg-light2 dark:bg-dark2">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={value}
          initial={{
            y: increasing ? 100 : -100,
            opacity: 0,
            filter: "blur(5px)",
            scale: 0.8,
          }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
          exit={{
            y: increasing ? -100 : 100,
            opacity: 0,
            scale: 0.8,
            filter: "blur(5px)",
          }}
          transition={{
            duration: 0.3,
            delay: 0.05,
            type: "spring",
            stiffness: 700,
            damping: 30,
            mass: 1,
            bounce: 0.5,
          }}
          className="text-ligh12 absolute inset-0 flex items-center justify-center text-2xl font-semibold dark:text-dark12"
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function NumberFlow() {
  const [value, setValue] = useState(0)
  const prevValue = useRef(0)
  const min = 0
  const max = 999

  useEffect(() => {
    prevValue.current = value
  }, [value])

  const increment = () => setValue((prev) => Math.min(prev + 1, max))
  const decrement = () => setValue((prev) => Math.max(prev - 1, min))

  const digits = value.toString().padStart(3, "0").split("").map(Number)
  const prevDigits = prevValue.current
    .toString()
    .padStart(3, "0")
    .split("")
    .map(Number)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <div className="flex items-center gap-2 rounded-xl bg-light1 p-4 shadow-sm dark:bg-dark1">
        <motion.div
          className="flex items-center gap-1"
          transition={springTransition}
        >
          {digits.map((digit, index) => (
            <AnimatedDigit
              key={`digit-${index}`}
              value={digit}
              prev={prevDigits[index]}
              index={index}
              total={digits.length}
            />
          ))}
        </motion.div>
        <div className="flex flex-col gap-1">
          <button
            onClick={increment}
            disabled={value >= max}
            className="relative w-auto overflow-hidden rounded-md border border-light3 bg-light1 p-2 disabled:opacity-50 dark:border-dark3 dark:bg-dark1"
          >
            <Plus className="h-3 w-3" />
          </button>
          <button
            onClick={decrement}
            disabled={value <= min}
            className="relative w-auto overflow-hidden rounded-md border border-light3 bg-light1 p-2 disabled:opacity-50 dark:border-dark3 dark:bg-dark1"
          >
            <Minus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
