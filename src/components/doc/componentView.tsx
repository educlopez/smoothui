"use client"

import { useState } from "react"

import { cn } from "@/components/smoothui/utils/cn"

type ComponentViewProps = {
  isReloadAnimation?: boolean
} & React.ComponentProps<"div">

export function ComponentView({ children }: ComponentViewProps) {
  const [reloadKey, setReloadKey] = useState(0)

  function handleReload() {
    setReloadKey((prevKey) => prevKey + 1)
  }

  return (
    <div
      className={cn(
        "bg-primary relative flex h-auto min-h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border py-12 transition md:h-[640px] md:flex-1"
      )}
    >
      {children}
    </div>
  )
}
