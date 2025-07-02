"use client"

import ScrambleHover from "@/components/smoothui/ui/ScrambleHover"

export default function ScrambleHoverDemo() {
  return (
    <div className="relative max-w-md space-y-6">
      <div>
        <h2 className="text-xl font-bold">ScrambleHover Demo</h2>
        <ScrambleHover>Hover over this text!</ScrambleHover>
        <div>
          <ScrambleHover
            duration={1200}
            speed={50}
            className="text-brand font-mono text-lg"
          >
            Custom duration and speed example
          </ScrambleHover>
        </div>
        <div>
          <ScrambleHover className="text-2xl font-semibold">
            Try me too!
          </ScrambleHover>
        </div>
      </div>
    </div>
  )
}
