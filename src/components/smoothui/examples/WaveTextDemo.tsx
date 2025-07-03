"use client"

import WaveText from "@/components/smoothui/ui/WaveText"

export default function WaveTextDemo() {
  return (
    <div className="relative max-w-md space-y-6">
      <div>
        <WaveText>Wave animation for your text!</WaveText>
        <div>
          <WaveText amplitude={16} className="text-brand text-lg font-bold">
            Higher amplitude wave
          </WaveText>
        </div>
        <div>
          <WaveText speed={0.1} className="text-2xl font-semibold">
            Faster wave speed
          </WaveText>
        </div>
      </div>
    </div>
  )
}
