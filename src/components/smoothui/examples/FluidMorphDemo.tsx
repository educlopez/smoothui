"use client"

import React, { useState } from "react"

import FluidMorph from "@/components/smoothui/ui/FluidMorph"

const demoPaths = [
  "M128 40L230 215.766H26L128 40Z",
  "M212 132L132 212M196 44L44 196",
  "M45.125 134.46C45.125 148.06 54.6705 159.909 68.1345 161.89C77.374 163.25 86.707 164.295 96.125 165.026V204.5L130.771 169.854C133.121 167.519 136.274 166.172 139.585 166.089C155.747 165.641 171.869 164.239 187.865 161.89C201.329 159.909 210.875 148.069 210.875 134.452V83.2985C210.875 69.6815 201.329 57.841 187.865 55.8605C168.043 52.9511 148.035 51.4937 128 51.5C107.668 51.5 87.676 52.9875 68.1345 55.8605C54.6705 57.841 45.125 69.69 45.125 83.2985V134.452V134.46Z",
]

const FluidMorphDemo = () => {
  const [index, setIndex] = useState(0)
  return (
    <div>
      <FluidMorph
        paths={demoPaths}
        circleCount={60}
        circleRadius={10}
        initialIndex={index}
        onChange={setIndex}
      />
    </div>
  )
}

export default FluidMorphDemo
