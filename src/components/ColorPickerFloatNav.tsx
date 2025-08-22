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

// Helper to generate light and lighter variations of a color
function generateColorVariations(baseColor: string) {
  // Handle different color formats
  if (baseColor.startsWith("oklch")) {
    // For oklch colors, we can manipulate lightness and chroma
    const lightColor = baseColor.replace(
      /oklch\(([^)]+)\)/,
      (match, values) => {
        const parts = values.split(" ")
        const lightness = Math.min(parseFloat(parts[0]) + 0.1, 1.0)
        const chroma = Math.max(parseFloat(parts[1]) - 0.05, 0)
        const hue = parts[2]
        return `oklch(${lightness} ${chroma} ${hue})`
      }
    )

    const lighterColor = baseColor.replace(
      /oklch\(([^)]+)\)/,
      (match, values) => {
        const parts = values.split(" ")
        const lightness = Math.min(parseFloat(parts[0]) + 0.2, 1.0)
        const chroma = Math.max(parseFloat(parts[1]) - 0.1, 0)
        const hue = parts[2]
        return `oklch(${lightness} ${chroma} ${hue})`
      }
    )

    return { lightColor, lighterColor }
  } else if (baseColor.startsWith("#")) {
    // For hex colors, convert to HSL and manipulate
    const hex = baseColor.replace("#", "")
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255

    // Simple RGB to HSL conversion
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h: number,
      s: number,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
        default:
          h = 0
          break
      }
      h /= 6
    }

    // Create lighter variations
    const lightL = Math.min(l + 0.15, 1.0)
    const lighterL = Math.min(l + 0.25, 1.0)

    // Convert back to hex
    const lightColor = hslToHex(h, s, lightL)
    const lighterColor = hslToHex(h, s, lighterL)

    return { lightColor, lighterColor }
  } else {
    // Fallback to opacity-based approach
    const lightColor = baseColor
      .replace(")", " / 0.7)")
      .replace("oklch", "oklch")
    const lighterColor = baseColor
      .replace(")", " / 0.5)")
      .replace("oklch", "oklch")

    return { lightColor, lighterColor }
  }
}

// Generate a complete color palette for a theme
function generateColorPalette(primaryColor: string, secondaryColor: string) {
  const primaryVariations = generateColorVariations(primaryColor)
  const secondaryVariations = generateColorVariations(secondaryColor)

  return {
    primary: primaryColor,
    primaryLight: primaryVariations.lightColor,
    primaryLighter: primaryVariations.lighterColor,
    secondary: secondaryColor,
    secondaryLight: secondaryVariations.lightColor,
    secondaryLighter: secondaryVariations.lighterColor,
  }
}

// Helper function to convert HSL to hex
function hslToHex(h: number, s: number, l: number): string {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
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
  {
    name: "Green",
    candy: "#10B981",
    candySecondary: "#059669",
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

        // Generate and set complete color palette
        const palette = generateColorPalette(candy, candySecondary)
        document.body.style.setProperty("--color-brand", palette.primary)
        document.body.style.setProperty(
          "--color-brand-light",
          palette.primaryLight
        )
        document.body.style.setProperty(
          "--color-brand-lighter",
          palette.primaryLighter
        )
        document.body.style.setProperty(
          "--color-brand-secondary",
          palette.secondary
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
    if (variable === "--color-brand") {
      setCandy(value)
      // Generate and set complete color palette
      const palette = generateColorPalette(value, candySecondary)
      document.body.style.setProperty(
        "--color-brand-light",
        palette.primaryLight
      )
      document.body.style.setProperty(
        "--color-brand-lighter",
        palette.primaryLighter
      )
    }
    if (variable === "--color-brand-secondary") {
      setCandySecondary(value)
      // Regenerate palette with new secondary color
      const palette = generateColorPalette(candy, value)
      document.body.style.setProperty(
        "--color-brand-light",
        palette.primaryLight
      )
      document.body.style.setProperty(
        "--color-brand-lighter",
        palette.primaryLighter
      )
      updateShadowCustomCandy(value)
    }
  }

  function handleReset() {
    // Remove custom variables so CSS falls back to default
    document.body.style.removeProperty("--color-brand")
    document.body.style.removeProperty("--color-brand-secondary")
    document.body.style.removeProperty("--color-brand-light")
    document.body.style.removeProperty("--color-brand-lighter")
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
        type="button"
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

                    // Generate and set complete color palette
                    const colorPalette = generateColorPalette(
                      palette.candy,
                      palette.candySecondary
                    )
                    document.body.style.setProperty(
                      "--color-brand",
                      colorPalette.primary
                    )
                    document.body.style.setProperty(
                      "--color-brand-light",
                      colorPalette.primaryLight
                    )
                    document.body.style.setProperty(
                      "--color-brand-lighter",
                      colorPalette.primaryLighter
                    )
                    document.body.style.setProperty(
                      "--color-brand-secondary",
                      colorPalette.secondary
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
