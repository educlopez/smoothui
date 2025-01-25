"use client"

import React, { useState } from "react"
import { Check, Code, Copy, Eye, FlaskConical } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

import type { ComponentsProps } from "@/app/doc/data"
import { cn } from "@/app/utils/cn"
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
      <div className="mx-auto w-full px-4">
        <article className="grid gap-3">
          {!clean && (
            <>
              <div className="flex justify-between gap-8">
                <div className="flex items-center gap-2">
                  <h3 className="text-light12 dark:text-dark12 text-sm font-medium transition">
                    <span className="text-light11 dark:text-dark11 transition">
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
                    className="bg-light3 text-light12 hover:bg-light4 dark:bg-dark3 dark:text-dark12 dark:hover:bg-dark4 flex w-32 items-center gap-2 overflow-hidden rounded-full px-3 py-1 text-center text-sm font-medium transition"
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
            className="border-light3 bg-light1 dark:border-dark3 dark:bg-dark1 relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-lg border transition md:flex-1"
          >
            {!clean && showCode ? (
              <>
                <SyntaxHighlighter
                  language="typescript"
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    height: "100%",
                    width: "100%",
                    overflow: "auto",
                  }}
                >
                  {component.code || "// Code not available"}
                </SyntaxHighlighter>
                <AnimatePresence mode="popLayout" initial={false}>
                  <button
                    key={isCopied ? "check" : "copy"}
                    onClick={handleCopyCode}
                    className="bg-light3 text-light12 hover:bg-light4 dark:bg-dark3 dark:text-dark12 dark:hover:bg-dark4 absolute top-2 right-2 rounded-md p-2 transition"
                    aria-label="Copy code"
                  >
                    {isCopied ? (
                      <motion.span
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{
                          type: "spring",
                          duration: 0.3,
                          bounce: 0,
                        }}
                      >
                        <Check size={16} />
                      </motion.span>
                    ) : (
                      <motion.span
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{
                          type: "spring",
                          duration: 0.3,
                          bounce: 0,
                        }}
                      >
                        <Copy size={16} />
                      </motion.span>
                    )}
                  </button>
                </AnimatePresence>
              </>
            ) : component.componentUi ? (
              React.createElement(component.componentUi)
            ) : null}
          </div>
          {!clean && (
            <>
              <div className="flex justify-between gap-8">
                <div className="flex items-center gap-1 odd:border-pink-400">
                  {component.tags.map((tag) => (
                    <div
                      key={tag}
                      className="border-light3 text-light11 dark:border-dark3 dark:text-dark11 inline-flex h-[24px] cursor-default items-center justify-center gap-2 rounded-full border px-2 text-xs transition select-none"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-light12 dark:text-dark12 text-sm transition">
                {component.info}
              </p>
            </>
          )}
        </article>
      </div>
    </div>
  )
}
