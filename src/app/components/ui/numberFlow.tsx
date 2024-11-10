"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
    <div className="relative h-16 w-12 overflow-hidden rounded-lg bg-white">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={value}
          initial={{ y: increasing ? 100 : -100 ,opacity: 0,
            scale: 0.8 }}
          animate={{ y: 0, opacity: 1,
            scale: 1 }}
          exit={{ y: increasing ? -100 : 100,  opacity: 0,scale: 0.8}}
          transition={{
            duration: 0.3,
            delay: (total - index - 1) * 0.1,
            type: "spring",
            stiffness: 700,
            damping: 30,
            mass: 1,
          }}
          className="absolute inset-0 flex items-center justify-center text-2xl font-semibold"
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 ">
      <div className="flex items-center gap-2 rounded-xl bg-white p-4 shadow-lg">
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
        <div className="ml-2 flex flex-col gap-2">
        <button
            onClick={increment}
            disabled={value >= max}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button

            onClick={decrement}
            disabled={value <= min}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}