"use client"

import React, { useState } from "react"
import Link from "next/link"
import { BookOpen, Code, Eye, FlaskConical } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/components/smoothui/utils/cn"
import type { ComponentsProps } from "@/app/doc/data/typeComponent"
import { copyToClipboard } from "@/app/utils/copyToClipboard"

interface FrameProps {
  component: ComponentsProps
  className?: string
  clean?: boolean
  group: string
}

export default function Frame({
  component,
  className,
  clean = false,
  group,
}: FrameProps) {
  const [showCode, setShowCode] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const toggleView = () => {
    setShowCode(!showCode)
  }

  const handleCopyCode = async () => {
    if (component.code) {
      const success = await copyToClipboard(component.code)
      if (success) {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 1000)
      }
    }
  }

  return (
    <div
      className={cn("w-full py-12 last:pb-0 odd:pt-0 md:w-[600px]", className)}
    >
      <div className="mx-auto w-full">
        <article className="grid gap-3">
          <div
            id={`component-${component.id}`}
            className="border-smooth-200 bg-smooth-100 relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-lg border transition md:flex-1"
          >
            {/* Floating docs button */}
            {!clean && component.slug && (
              <Link
                href={`/doc/${group}/${component.slug}`}
                className="bg-background/80 absolute top-2 right-2 z-1 flex h-8 w-8 items-center justify-center rounded-md border backdrop-blur-lg transition hover:bg-white dark:hover:bg-black/50"
                title={`Go to docs for ${component.componentTitle}`}
                aria-label={`Go to docs for ${component.componentTitle}`}
              >
                <BookOpen size={12} className="text-foreground" />
              </Link>
            )}
            {component.componentUi &&
              React.createElement(component.componentUi)}
          </div>
        </article>
      </div>
    </div>
  )
}
