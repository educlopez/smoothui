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

export default function ButtonCopy() {
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
        className="border-light-200 bg-light-50 dark:border-dark-200 dark:bg-dark-50 relative w-auto cursor-pointer overflow-hidden rounded-full border p-3 disabled:opacity-50"
        disabled={buttonState !== "idle"}
        onClick={handleClick}
        aria-label={buttonState === "loading" ? "Copying..." : "Copy"}
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
