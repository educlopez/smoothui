"use client"

import { useState } from "react"

import { RefreshButton } from "@/components/doc/refreshButton"
import { cn } from "@/components/smoothui/utils/cn"

type ComponentViewProps = {
  isReloadAnimation?: boolean
  hasRefreshDemo?: boolean
} & React.ComponentProps<"div">

export function ComponentView({
  children,
  hasRefreshDemo = true,
}: ComponentViewProps) {
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
      {hasRefreshDemo && <RefreshButton onRefresh={handleReload} />}
      <div key={reloadKey}>{children}</div>
    </div>
  )
}
