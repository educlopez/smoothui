"use client"

import * as React from "react"

import { CodeBlockWrapper } from "@/components/doc/codeBlocKWarapper"
import { cn } from "@/components/smoothui/utils/cn"

interface ComponentSourceProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
}

export function ComponentSource({
  children,
  className,
  ...props
}: ComponentSourceProps) {
  return (
    <CodeBlockWrapper
      expandButtonTitle="Expand"
      className={cn("my-6 overflow-hidden rounded-md", className)}
    >
      {children}
    </CodeBlockWrapper>
  )
}
