"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"

import { Button } from "../button"

interface RefreshButtonProps {
  onRefresh: () => void
}

export function RefreshButton({ onRefresh }: RefreshButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onRefresh}
      className="group absolute top-17 right-2 z-10"
      aria-label="Refresh preview"
    >
      <RefreshCw
        className="transition-transform duration-300 group-hover:rotate-180"
        size={16}
      />
    </Button>
  )
}
