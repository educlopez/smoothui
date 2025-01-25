"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { motion } from "motion/react"

import { useColor } from "@/app/doc/context/ColorContext"

interface ColorScheme {
  name: string
  colors: {
    neutral: string
    secondary: string
    accent: string
  }
}

const colorSchemes: ColorScheme[] = [
  {
    name: "default",
    colors: {
      neutral: "pink-500",
      secondary: "purple-500",
      accent: "blue-500",
    },
  },
  {
    name: "pink",
    colors: {
      neutral: "pink-500",
      secondary: "purple-500",
      accent: "blue-500",
    },
  },
  {
    name: "blue",
    colors: {
      neutral: "blue-500",
      secondary: "cyan-500",
      accent: "teal-500",
    },
  },
  {
    name: "green",
    colors: {
      neutral: "green-500",
      secondary: "emerald-500",
      accent: "lime-500",
    },
  },
  {
    name: "amber",
    colors: {
      neutral: "amber-500",
      secondary: "orange-500",
      accent: "yellow-500",
    },
  },
]

export function ColorSelector() {
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>(
    colorSchemes[0]
  )
  const { setSelectedColor } = useColor()

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    setSelectedScheme(scheme)
    // Set CSS custom properties for the color scheme
    document.documentElement.style.setProperty(
      "--color-neutral-50",
      `var(--color-${scheme.name.toLowerCase()}-50)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-100",
      `var(--color-${scheme.name.toLowerCase()}-100)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-200",
      `var(--color-${scheme.name.toLowerCase()}-200)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-300",
      `var(--color-${scheme.name.toLowerCase()}-300)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-400",
      `var(--color-${scheme.name.toLowerCase()}-400)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-500",
      `var(--color-${scheme.name.toLowerCase()}-500)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-600",
      `var(--color-${scheme.name.toLowerCase()}-600)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-700",
      `var(--color-${scheme.name.toLowerCase()}-700)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-800",
      `var(--color-${scheme.name.toLowerCase()}-800)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-900",
      `var(--color-${scheme.name.toLowerCase()}-900)`
    )
    document.documentElement.style.setProperty(
      "--color-neutral-950",
      `var(--color-${scheme.name.toLowerCase()}-950)`
    )

    setSelectedColor({
      name: scheme.name.toLowerCase(),
      color: scheme.name.toLowerCase(),
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-light-950 dark:text-dark-950 text-lg font-semibold">
        Color Scheme
      </h3>
      <div className="flex flex-row gap-1">
        {colorSchemes.map((scheme) => (
          <motion.button
            key={scheme.name}
            onClick={() => handleColorSchemeChange(scheme)}
            className={`relative flex flex-col items-center space-y-2 rounded-lg border p-4 transition-all ${
              selectedScheme.name === scheme.name
                ? `border-${scheme.name.toLowerCase()}-500 bg-${scheme.name.toLowerCase()}-500/10`
                : "border-light-200 dark:border-dark-200 hover:border-stone-500/50"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={`h-6 w-6 rounded-full bg-${scheme.colors.neutral}`}
            />

            {selectedScheme.name === scheme.name && (
              <div className="absolute top-2 right-2">
                <Check
                  className={`h-4 w-4 text-${scheme.name.toLowerCase()}-500`}
                />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
