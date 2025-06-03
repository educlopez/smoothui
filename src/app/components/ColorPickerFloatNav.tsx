"use client"

import { useEffect, useRef, useState } from "react"
import { Check, CheckCheck, RotateCcw, Save } from "lucide-react"

import { Button } from "./button"

// Helper to update shadow when secondary color changes
function updateShadowCustomCandy(candySecondary: string) {
  document.body.style.setProperty(
    "--shadow-custom-candy",
    `0px 1px 2px #0006, 0px 0px 0px 1px ${candySecondary}, inset 0px .75px 0px #fff3`
  )
}

// Predefined palettes
const PALETTES = [
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
        document.body.style.setProperty("--color-candy", candy)
        document.body.style.setProperty(
          "--color-candy-secondary",
          candySecondary
        )
        updateShadowCustomCandy(candySecondary)
        setOriginalCandy(candy)
        setOriginalCandySecondary(candySecondary)
        return
      } catch {}
    }
    const c = getComputedStyle(document.body)
      .getPropertyValue("--color-candy")
      .trim()
    const cs = getComputedStyle(document.body)
      .getPropertyValue("--color-candy-secondary")
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
    if (variable === "--color-candy") setCandy(value)
    if (variable === "--color-candy-secondary") {
      setCandySecondary(value)
      updateShadowCustomCandy(value)
    }
  }

  function handleReset() {
    setCandy(originalCandy)
    setCandySecondary(originalCandySecondary)
    document.body.style.setProperty("--color-candy", originalCandy)
    document.body.style.setProperty(
      "--color-candy-secondary",
      originalCandySecondary
    )
    updateShadowCustomCandy(originalCandySecondary)
    localStorage.removeItem("smoothui-colors")
    const c = getComputedStyle(document.body)
      .getPropertyValue("--color-candy")
      .trim()
    const cs = getComputedStyle(document.body)
      .getPropertyValue("--color-candy-secondary")
      .trim()
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
    <div className="relative" ref={pickerRef}>
      <button
        aria-label="Open color picker"
        className="shadow-custom-candy flex h-5 w-5 cursor-pointer items-center gap-1 overflow-hidden rounded-sm border transition-all duration-200"
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
      {show && (
        <div
          className="bg-background absolute bottom-12 left-1/2 z-50 flex min-w-[220px] -translate-x-1/2 flex-col items-center rounded-xl border p-2 shadow-2xl transition-all duration-200"
          style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          {/* Minimal palette selector */}
          <div className="mb-2 flex flex-row gap-3">
            {/* Default palette */}
            <button
              type="button"
              className={`relative h-8 w-8 rounded-md transition-all focus:outline-none ${candy === originalCandy && candySecondary === originalCandySecondary ? "shadow-custom-candy cursor-not-allowed border" : "cursor-pointer border border-transparent"}`}
              style={{
                background: `linear-gradient(135deg, ${originalCandy} 60%, ${originalCandySecondary} 100%)`,
              }}
              onClick={() => {
                setCandy(originalCandy)
                setCandySecondary(originalCandySecondary)
                document.body.style.setProperty("--color-candy", originalCandy)
                document.body.style.setProperty(
                  "--color-candy-secondary",
                  originalCandySecondary
                )
                updateShadowCustomCandy(originalCandySecondary)
              }}
              aria-label="Select Default palette"
            >
              {candy === originalCandy &&
                candySecondary === originalCandySecondary && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="rounded-full bg-white/40 p-0.5">
                      <Check className="h-4 w-4 text-white" />
                    </span>
                  </span>
                )}
            </button>
            {/* Other palettes */}
            {PALETTES.map((palette) => (
              <button
                key={palette.name}
                type="button"
                className={`relative h-8 w-8 rounded-md transition-all focus:outline-none ${palette.candy === candy && palette.candySecondary === candySecondary ? "shadow-custom-candy cursor-not-allowed border" : "cursor-pointer border border-transparent"}`}
                style={{
                  background: `linear-gradient(135deg, ${palette.candy} 60%, ${palette.candySecondary} 100%)`,
                }}
                onClick={() => {
                  setCandy(palette.candy)
                  setCandySecondary(palette.candySecondary)
                  document.body.style.setProperty(
                    "--color-candy",
                    palette.candy
                  )
                  document.body.style.setProperty(
                    "--color-candy-secondary",
                    palette.candySecondary
                  )
                  updateShadowCustomCandy(palette.candySecondary)
                }}
                aria-label={`Select ${palette.name} palette`}
              >
                {palette.candy === candy &&
                  palette.candySecondary === candySecondary && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="rounded-full bg-white/40 p-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </span>
                    </span>
                  )}
              </button>
            ))}
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
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
        </div>
      )}
    </div>
  )
}
