"use client"

import { useState } from "react"

import AnimatedProgressBar from "@/components/smoothui/ui/AnimatedProgressBar"

export default function AnimatedProgressBarDemo() {
  const [value, setValue] = useState(40)
  const [refreshKey, setRefreshKey] = useState(0)
  return (
    <div className="max-w-xs space-y-6">
      <AnimatedProgressBar
        key={refreshKey}
        value={value}
        label={`Progress: ${value}%`}
      />
      <AnimatedProgressBar
        key={refreshKey + 1000}
        value={value}
        color="#22d3ee"
        label="Custom Color"
      />
      <div className="mt-4 flex gap-2">
        <button
          className="bg-primary rounded px-4 py-2 text-white"
          onClick={() => setValue((v) => (v >= 100 ? 0 : v + 10))}
        >
          Increase
        </button>
        <button
          className="bg-secondary rounded px-4 py-2 text-black"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          Refresh
        </button>
      </div>
    </div>
  )
}
