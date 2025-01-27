"use client"

import * as React from "react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/doc/_components/collapsible"
import { cn } from "@/app/utils/cn"

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  expandButtonTitle?: string
}

export function CodeBlockWrapper({
  expandButtonTitle = "View Code",
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [isOpened, setIsOpened] = React.useState(false)

  return (
    <Collapsible open={isOpened} onOpenChange={setIsOpened}>
      <div className={cn("relative overflow-hidden", className)} {...props}>
        <CollapsibleContent
          forceMount
          className={cn("overflow-hidden", !isOpened && "max-h-42")}
        >
          <div
            className={cn(
              "[&_pre]:my-0 [&_pre]:max-h-[650px] [&_pre]:pb-[100px]",
              !isOpened ? "[&_pre]:overflow-hidden" : "[&_pre]:overflow-auto]"
            )}
          >
            {children}
          </div>
        </CollapsibleContent>
        <div
          className={cn(
            "dark:from-dark-50/10 from-light-50/10 dark:to-dark-50/90 to-light-50/90 absolute flex items-end justify-center bg-gradient-to-b p-2",
            isOpened ? "inset-x-0 bottom-0 h-12" : "inset-0"
          )}
        >
          <CollapsibleTrigger asChild>
            <button className="bg-light-200 dark:bg-dark-200 dark:text-dark-900 text-light-900 flex w-auto cursor-pointer items-center justify-center rounded-md px-3 py-1 text-sm">
              {isOpened ? "Collapse" : expandButtonTitle}
            </button>
          </CollapsibleTrigger>
        </div>
      </div>
    </Collapsible>
  )
}
