"use client"

import React, { useState } from "react"

import PowerOffSlide from "@/components/smoothui/ui/PowerOffSlide"

const PowerOffSlideDemo = () => {
  const [poweredOff, setPoweredOff] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <PowerOffSlide
        label="Slide to power off"
        duration={1500}
        onPowerOff={() => setPoweredOff(true)}
      />
    </div>
  )
}

export default PowerOffSlideDemo
