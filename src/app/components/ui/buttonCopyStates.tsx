"use client"

import { ReactNode, useCallback, useState } from "react"
import { Check, Copy, LoaderCircle } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

interface Button {
  idle: ReactNode
  loading: ReactNode
  success: ReactNode
}

const buttonCopy: Button = {
  idle: <Copy size={16} />,
  loading: <LoaderCircle size={16} className="animate-spin" />,
  success: <Check size={16} />,
}

export default function ButtonCopyStates() {
  const [buttonState, setButtonState] = useState<keyof Button>("idle")

  const handleClick = useCallback(() => {
    setButtonState("loading")
    setTimeout(() => {
      setButtonState("success")
    }, 1000)

    setTimeout(() => {
      setButtonState("idle")
    }, 3000)
  }, [])

  return (
    <div className="flex justify-center">
      <button
        className="relative w-auto overflow-hidden rounded-full border border-light3 bg-light1 p-3 disabled:opacity-50 dark:border-dark3 dark:bg-dark1"
        disabled={buttonState !== "idle"}
        onClick={handleClick}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            initial={{ opacity: 0, y: -25, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 25, filter: "blur(10px)" }}
            key={buttonState}
            className="flex w-full items-center justify-center"
          >
            {buttonCopy[buttonState]}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  )
}
