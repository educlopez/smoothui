"use client"

import React, { useState } from "react"
import { Code, Eye, FlaskConical } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/components/smoothui/utils/cn"
import type { ComponentsProps } from "@/app/doc/data/components"
import { copyToClipboard } from "@/app/utils/copyToClipboard"

interface FrameProps {
  component: ComponentsProps
  className?: string
  clean?: boolean
}

export default function Frame({
  component,
  className,
  clean = false,
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
          {!clean && (
            <>
              <div className="flex justify-between gap-8">
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground text-sm font-medium transition">
                    <span className="text-primary-foreground transition">
                      #{component.id}
                    </span>{" "}
                    {component.componentTitle}
                  </h3>
                  {component.isUpdated && (
                    <span className="ml-2 flex flex-row gap-1 overflow-hidden rounded-md bg-pink-600/10 px-2 py-1 text-xs font-medium text-pink-600 transition-colors duration-200 ease-out select-none dark:bg-pink-600/15">
                      <FlaskConical size={14} /> Update
                    </span>
                  )}
                </div>
                <AnimatePresence mode="popLayout" initial={false}>
                  <button
                    key={showCode ? "check" : "copy"}
                    onClick={toggleView}
                    className="bg-smooth-200 text-foreground hover:bg-smooth-300 flex w-32 items-center gap-2 overflow-hidden rounded-full px-3 py-1 text-center text-sm font-medium transition"
                  >
                    {showCode ? (
                      <motion.span
                        key="view-component"
                        initial={{ opacity: 0, y: -25, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 25, filter: "blur(10px)" }}
                        transition={{
                          type: "spring",
                          duration: 0.3,
                          bounce: 0,
                        }}
                        className="flex w-full items-center justify-center gap-1"
                      >
                        <Eye size={16} /> <span>Component</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="view-code"
                        initial={{ opacity: 0, y: -25, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 25, filter: "blur(10px)" }}
                        transition={{
                          type: "spring",
                          duration: 0.3,
                          bounce: 0,
                        }}
                        className="flex w-full items-center justify-center gap-1"
                      >
                        <Code size={16} />
                        View Code
                      </motion.span>
                    )}
                  </button>
                </AnimatePresence>
              </div>
            </>
          )}
          <div
            id={`component-${component.id}`}
            className="border-smooth-200 bg-smooth-100 relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-lg border transition md:flex-1"
          >
            {component.componentUi &&
              React.createElement(component.componentUi)}
          </div>
          {!clean && (
            <>
              <div className="flex justify-between gap-8">
                <div className="flex items-center gap-1 odd:border-pink-400">
                  {component.tags.map((tag) => (
                    <div
                      key={tag}
                      className="border-smooth-200 text-primary-foreground inline-flex h-[24px] cursor-default items-center justify-center gap-2 rounded-full border px-2 text-xs transition select-none"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-foreground text-sm transition">
                {component.info}
              </p>
            </>
          )}
        </article>
      </div>
    </div>
  )
}
