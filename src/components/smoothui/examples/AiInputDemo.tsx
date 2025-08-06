"use client"

import { MorphSurface } from "@/components/smoothui/ui/AiInput"

export default function AiInputDemo() {
  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Main Demo */}
      <div className="relative">
        <MorphSurface />
      </div>
    </div>
  )
}
