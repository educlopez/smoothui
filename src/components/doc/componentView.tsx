"use client"

import { useState } from "react"

import { OpenInV0Button } from "@/components/doc/openInV0"
import { RefreshButton } from "@/components/doc/refreshButton"
import { cn } from "@/components/smoothui/utils/cn"

type ComponentViewProps = {
  isReloadAnimation?: boolean
  hasRefreshDemo?: boolean
  openInV0Url?: string
} & React.ComponentProps<"div">

export function ComponentView({
  children,
  hasRefreshDemo = true,
  openInV0Url,
}: ComponentViewProps) {
  const [reloadKey, setReloadKey] = useState(0)

  function handleReload() {
    setReloadKey((prevKey) => prevKey + 1)
  }

  return (
    <div
      className={cn(
        "frame-box relative flex h-auto min-h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border py-12 transition md:h-[640px] md:flex-1"
      )}
    >
      <div
        className={cn(
          "bg-background absolute top-4 right-4 z-20 flex gap-1 rounded-full border-[0.5px] p-1 shadow-xs hover:shadow-sm"
        )}
      >
        {openInV0Url && (
          <OpenInV0Button
            url={openInV0Url}
            className="bg-primary size-9 rounded-full border-[0.5px] px-2"
          />
        )}
        {hasRefreshDemo && (
          <RefreshButton
            onRefresh={handleReload}
            className="bg-primary size-9 rounded-full border-[0.5px] px-2"
          />
        )}
      </div>
      <div key={reloadKey}>{children}</div>
    </div>
  )
}
