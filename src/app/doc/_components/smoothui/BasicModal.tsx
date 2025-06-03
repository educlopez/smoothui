"use client"

import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useOnClickOutside } from "usehooks-ts"

interface BasicModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
}

export default function BasicModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: BasicModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>
  useOnClickOutside(modalRef, () => onClose())

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            className="bg-background/70 fixed inset-0 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === overlayRef.current) {
                onClose()
              }
            }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className={`${modalSizes[size]} bg-primary relative mx-auto w-full rounded-xl border p-4 shadow-xl sm:p-6`}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{
                scale: 0.95,
                y: 10,
                opacity: 0,
                transition: { duration: 0.15 },
              }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                {title && (
                  <h3 className="text-xl leading-6 font-medium">{title}</h3>
                )}
                <motion.button
                  className="hover:bg-secondary ml-auto rounded-full p-1.5 transition-colors"
                  onClick={onClose}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </motion.button>
              </div>

              {/* Content */}
              <div className="relative">{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-background cursor-pointer rounded-md border p-3 shadow-xs"
      >
        Open Modal
      </button>

      <BasicModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Beautiful Modal"
        size="md"
      >
        <div className="flex flex-col gap-4">
          <p>
            This is a beautiful animated modal with smooth entrance and exit
            animations. Click outside or press Escape to close.
          </p>

          <div className="flex flex-col gap-2">
            <h4 className="font-medium">Features:</h4>
            <ul className="list-inside list-disc space-y-1">
              <li>Smooth animations</li>
              <li>Backdrop blur effect</li>
              <li>Responsive design</li>
              <li>Keyboard navigation (ESC to close)</li>
              <li>Focus trapping (for accessibility)</li>
            </ul>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-secondary rounded-lg border px-4 py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-candy hover:bg-candy-secondary rounded-lg px-4 py-2 text-white transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </BasicModal>
    </div>
  )
}
