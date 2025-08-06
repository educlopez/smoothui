"use client"

import { useState } from "react"
import { Settings } from "lucide-react"

import { Button } from "@/components/button"

import SiriOrb from "../ui/SiriOrb"

const SiriOrbDemo: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<string>("192px")
  const [animationDuration, setAnimationDuration] = useState(20)
  const [showSettings, setShowSettings] = useState(false)

  const sizeOptions = [
    { value: "64px", label: "XS" },
    { value: "128px", label: "SM" },
    { value: "192px", label: "MD" },
    { value: "256px", label: "LG" },
    { value: "320px", label: "XL" },
  ]

  return (
    <div className="flex flex-col items-center">
      <SiriOrb
        size={selectedSize}
        animationDuration={animationDuration}
        colors={{
          bg: "var(--color-primary)",
        }}
        className="drop-shadow-2xl"
      />

      <div className="absolute right-4 bottom-4">
        <Button
          variant="candy"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
          className="h-10 w-10 rounded-full p-0"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {showSettings && (
        <div className="bg-background absolute right-4 bottom-[64px] flex w-fit flex-col justify-between gap-4 rounded-lg border p-4">
          <div>
            <div className="text-foreground mb-2 block text-sm font-medium">
              Size
            </div>
            <div className="flex gap-2">
              {sizeOptions.map((option) => (
                <Button
                  variant="candy"
                  size="sm"
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedSize(option.value as any)}
                  className={`h-auto w-auto px-2 py-1 ${
                    selectedSize === option.value ? "" : "opacity-50"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="animation-speed"
              className="text-foreground mb-2 block text-sm font-medium"
            >
              Animation Speed: {animationDuration}s
            </label>
            <input
              id="animation-speed"
              type="range"
              min="5"
              max="40"
              value={animationDuration}
              onChange={(e) => setAnimationDuration(Number(e.target.value))}
              className="slider bg-background h-2 w-full cursor-pointer appearance-none rounded-lg border"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: oklch(0.72 0.2 352.53);
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: oklch(0.72 0.2 352.53);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default SiriOrbDemo
