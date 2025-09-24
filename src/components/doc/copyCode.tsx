"use client"

import { ReactNode, useCallback, useState } from "react"
import { Check, Copy, LoaderCircle } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

type CopyCode = {
  code: string
  pageId?: string
  componentId?: string
  onCopy?: () => void
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

export function CopyCode({ code, pageId, componentId, onCopy }: CopyCode) {
  const [copied, setCopied] = useState(false)
  const [buttonState, setButtonState] = useState<keyof Button>("idle")

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setButtonState("loading")

      // Track copy event
      if (pageId) {
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "copy", pageId, componentId }),
        })
      }

      // Call custom onCopy handler
      if (onCopy) {
        onCopy()
      }

      setTimeout(() => {
        setButtonState("success")
      }, 500)

      setTimeout(() => {
        setButtonState("idle")
      }, 3000)
    } catch (error) {
      console.error("Failed to copy code:", error)
      setButtonState("idle")
    }
  }, [code, pageId, componentId, onCopy])

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
