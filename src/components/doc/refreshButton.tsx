"use client"

import * as React from "react"
import { RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"

import { Button } from "../button"

interface RefreshButtonProps {
  onRefresh: () => void
  className?: string
}

export function RefreshButton({ onRefresh, className }: RefreshButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onRefresh}
      className={cn("group !shadow-none", className)}
      aria-label="Refresh preview"
    >
      <RefreshCw
        className="transition-transform duration-300 group-hover:rotate-180"
        size={20}
      />
    </Button>
  )
}
