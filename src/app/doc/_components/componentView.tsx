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
        "border-light-200 bg-light-100 dark:border-dark-200 dark:bg-dark-100 relative flex h-auto min-h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border py-12 transition md:h-[640px] md:flex-1"
      )}
    >
      {children}
    </div>
  )
}
