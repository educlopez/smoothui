"use client"

import { ReactNode, useCallback, useState } from "react"
import { Check, Copy, LoaderCircle } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

type CopyCode = {
  code: string
}
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

export function CopyCode({ code }: CopyCode) {
  const [copied, setCopied] = useState(false)
  const [buttonState, setButtonState] = useState<keyof Button>("idle")

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setButtonState("loading")
    setTimeout(() => {
      setButtonState("success")
    }, 500)

    setTimeout(() => {
      setButtonState("idle")
    }, 3000)
  }, [code])

  return (
    <div className="z-10 flex justify-center">
      <button
        onClick={handleClick}
        disabled={buttonState !== "idle"}
        className="relative flex cursor-pointer items-center justify-center p-2"
        aria-label={buttonState === "loading" ? "Copying code..." : "Copy code"}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            initial={{ opacity: 0, y: -25, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 25, filter: "blur(10px)" }}
            key={buttonState}
            className="text-primary-foreground flex w-full items-center justify-center"
          >
            {buttonCopy[buttonState]}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  )
}
