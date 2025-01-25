"use client"

import { createContext, ReactNode, useContext, useState } from "react"

type ColorScheme = {
  name: string
  color: string
}

type ColorContextType = {
  selectedColor: ColorScheme
  setSelectedColor: (color: ColorScheme) => void
}

const defaultColor: ColorScheme = {
  name: "neutral",
  color: "neutral",
}

const ColorContext = createContext<ColorContextType | undefined>(undefined)

export function ColorProvider({ children }: { children: ReactNode }) {
  const [selectedColor, setSelectedColor] = useState<ColorScheme>(defaultColor)

  return (
    <ColorContext.Provider value={{ selectedColor, setSelectedColor }}>
      {children}
    </ColorContext.Provider>
  )
}

export function useColor() {
  const context = useContext(ColorContext)
  if (context === undefined) {
    throw new Error("useColor must be used within a ColorProvider")
  }
  return context
}
