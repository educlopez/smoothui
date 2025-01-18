"use client"

import { useState } from "react"

import { cn } from "@/app/utils/cn"

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
        "relative flex h-auto min-h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border border-light3 bg-light2 py-12 transition dark:border-dark3 dark:bg-dark2 md:h-[640px] md:flex-1"
      )}
    >
      {children}
    </div>
  )
}
