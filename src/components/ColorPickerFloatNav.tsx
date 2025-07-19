"use client"

import { useEffect, useRef, useState } from "react"
import { Check, CheckCheck, RotateCcw, Save } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { Button } from "./button"

// Helper to update shadow when secondary color changes
function updateShadowCustomCandy(candySecondary: string) {
  document.body.style.setProperty(
    "--shadow-custom-brand",
    `0px 1px 2px #0006, 0px 0px 0px 1px ${candySecondary}, inset 0px .75px 0px #fff3`
  )
}

// Predefined palettes
const PALETTES = [
  {
    name: "Candy",
    candy: "oklch(0.72 0.2 352.53)",
    candySecondary: "oklch(0.66 0.21 354.31)",
  },
  {
    name: "Indigo",
    candy: "#A764FF", // vibrant
    candySecondary: "#6E48EC", // darker
  },
  {
    name: "Blue",
    candy: "#4B94FD",
    candySecondary: "#1477F6",
  },
  {
    name: "Red",
    candy: "#FD4B4E",
    candySecondary: "#F61418",
  },
  {
    name: "Orange",
    candy: "#FF8743",
    candySecondary: "#FF5C00",
  },
]

export function ColorPickerFloatNav() {
  const [open, setOpen] = useState(false)
  const [candy, setCandy] = useState("")
  const [candySecondary, setCandySecondary] = useState("")
  const [originalCandy, setOriginalCandy] = useState("")
  const [originalCandySecondary, setOriginalCandySecondary] = useState("")
  const pickerRef = useRef<HTMLDivElement>(null)

  // Load from localStorage or CSS variables on mount
  useEffect(() => {
    const saved = localStorage.getItem("smoothui-colors")
    if (saved) {
      try {
        const { candy, candySecondary } = JSON.parse(saved)
        setCandy(candy)
        setCandySecondary(candySecondary)
        document.body.style.setProperty("--color-brand", candy)
        document.body.style.setProperty(
          "--color-brand-secondary",
          candySecondary
        )
        updateShadowCustomCandy(candySecondary)
        setOriginalCandy(candy)
        setOriginalCandySecondary(candySecondary)
        return
      } catch {}
    }
    const c = getComputedStyle(document.body)
      .getPropertyValue("--color-brand")
      .trim()
    const cs = getComputedStyle(document.body)
      .getPropertyValue("--color-brand-secondary")
      .trim()
    setCandy(c)
    setCandySecondary(cs)
    setOriginalCandy(c)
    setOriginalCandySecondary(cs)
    updateShadowCustomCandy(cs)
  }, [])

  // Cierra el selector si se hace click fuera o Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  function handleColorChange(variable: string, value: string) {
    document.body.style.setProperty(variable, value)
    if (variable === "--color-brand") setCandy(value)
    if (variable === "--color-brand-secondary") {
      setCandySecondary(value)
      updateShadowCustomCandy(value)
    }
  }

  function handleReset() {
    // Remove custom variables so CSS falls back to default
    document.body.style.removeProperty("--color-brand")
    document.body.style.removeProperty("--color-brand-secondary")
    document.body.style.removeProperty("--shadow-custom-brand") // Remove shadow as well

    // Remove from localStorage
    localStorage.removeItem("smoothui-colors")

    // Read the default values from CSS
    const c = getComputedStyle(document.body)
      .getPropertyValue("--color-brand")
      .trim()
    const cs = getComputedStyle(document.body)
      .getPropertyValue("--color-brand-secondary")
      .trim()

    setCandy(c)
    setCandySecondary(cs)
    setOriginalCandy(c)
    setOriginalCandySecondary(cs)
  }

  function handleSave() {
    localStorage.setItem(
      "smoothui-colors",
      JSON.stringify({ candy, candySecondary })
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 1200)
  }

  // For animation
  const [show, setShow] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    if (open) {
      setShow(true)
    } else {
      const timeout = setTimeout(() => setShow(false), 200)
      return () => clearTimeout(timeout)
    }
  }, [open])

  return (
    <div className="float-trigger relative !p-2" ref={pickerRef}>
      <button
        aria-label="Open color picker"
        className="shadow-custom-brand flex h-5 w-5 cursor-pointer items-center gap-1 overflow-hidden rounded-sm border transition-all duration-200"
        style={{
          background: `linear-gradient(90deg, ${candy} 60%, ${candySecondary} 100%)`,
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="h-full w-full"
          style={{
            background: `linear-gradient(135deg, ${candy} 60%, ${candySecondary} 100%)`,
          }}
        />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-background absolute bottom-12 left-1/2 z-50 flex min-w-[220px] -translate-x-1/2 flex-col items-center rounded-xl border p-2 shadow-2xl"
            style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            {/* Minimal palette selector */}
            <div className="mb-2 flex flex-row gap-3">
              {/* Other palettes */}
              {PALETTES.map((palette) => (
                <motion.button
                  key={palette.name}
                  type="button"
                  className={`relative h-8 w-8 rounded-md transition-all focus:outline-none ${palette.candy === candy && palette.candySecondary === candySecondary ? "shadow-custom-brand cursor-not-allowed border" : "cursor-pointer border border-transparent"}`}
                  style={{
                    background: `linear-gradient(135deg, ${palette.candy} 60%, ${palette.candySecondary} 100%)`,
                  }}
                  onClick={() => {
                    setCandy(palette.candy)
                    setCandySecondary(palette.candySecondary)
                    document.body.style.setProperty(
                      "--color-brand",
                      palette.candy
                    )
                    document.body.style.setProperty(
                      "--color-brand-secondary",
                      palette.candySecondary
                    )
                    updateShadowCustomCandy(palette.candySecondary)
                  }}
                  aria-label={`Select ${palette.name} palette`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    palette.candy === candy &&
                    palette.candySecondary === candySecondary
                      ? { scale: 1.12 }
                      : { scale: 1 }
                  }
                >
                  <AnimatePresence>
                    {palette.candy === candy &&
                      palette.candySecondary === candySecondary && (
                        <motion.span
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        >
                          <span className="rounded-full bg-white/40 p-0.5">
                            <Check className="h-4 w-4 text-white" />
                          </span>
                        </motion.span>
                      )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </div>
            <div className="mt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                aria-label="Reset to original colors"
                size="sm"
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                Reset
              </Button>
              <Button
                type="button"
                variant="candy"
                size="sm"
                onClick={handleSave}
                aria-label="Save colors to browser"
              >
                {saved ? (
                  <>
                    <CheckCheck className="h-4 w-4" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Save
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
