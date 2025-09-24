"use client"

import { useState } from "react"

import { Button } from "@/components/button"
import PriceFlow from "@/components/smoothui/ui/PriceFlow"

const PriceFlowDemo = () => {
  const [value, setValue] = useState(25)

  const handlePriceChange = () => {
    setValue(value === 25 ? 16 : 25)
  }

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <div className="text-foreground text-6xl font-bold">
          <PriceFlow value={value} />€
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" onClick={handlePriceChange} variant="candy">
          Change Price
        </Button>
      </div>
    </div>
  )
}

export default PriceFlowDemo
