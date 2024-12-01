"use client"

import React, { useState } from "react"
import { Check, Code, Copy, Eye } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

import type { ComponentsProps } from "@/app/data"
import { copyToClipboard } from "@/app/utils/copyToClipboard"

export default function Frame({ component }: { component: ComponentsProps }) {
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
    <div className="w-full py-12 last:pb-0 odd:pt-0 md:w-[600px]">
      <div className="mx-auto w-full px-4">
        <article className="grid gap-3">
          <div className="flex justify-between gap-8">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium text-light12 transition dark:text-dark12">
                <span className="text-light11 transition dark:text-dark11">
                  #{component.id}
                </span>{" "}
                {component.componentTitle}
              </h3>
            </div>
            <AnimatePresence mode="popLayout" initial={false}>
              <button
                key={showCode ? "check" : "copy"}
                onClick={toggleView}
                className="flex w-32 items-center gap-2 overflow-hidden rounded-full bg-light3 px-3 py-1 text-center text-sm font-medium text-light12 transition hover:bg-light4 dark:bg-dark3 dark:text-dark12 dark:hover:bg-dark4"
              >
                {showCode ? (
                  <motion.span
                    key="view-component"
                    initial={{ opacity: 0, y: -25, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 25, filter: "blur(10px)" }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    className="flex w-full items-center justify-center gap-1"
                  >
                    <Eye size={16} /> <span>Component</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="view-component"
                    initial={{ opacity: 0, y: -25, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 25, filter: "blur(10px)" }}
                    transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                    className="flex w-full items-center justify-center gap-1"
                  >
                    <Code size={16} />
                    View Code
                  </motion.span>
                )}
              </button>
            </AnimatePresence>
          </div>
          <div
            id={`component-${component.id}`}
            className="relative flex h-auto min-h-[300px] w-full items-center justify-center overflow-hidden rounded-lg border border-light3 bg-light2 transition dark:border-dark3 dark:bg-dark2 md:h-[640px] md:flex-1"
          >
            {showCode ? (
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
                    className="absolute right-2 top-2 rounded-md bg-light3 p-2 text-light12 transition hover:bg-light4 dark:bg-dark3 dark:text-dark12 dark:hover:bg-dark4"
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
          <div className="flex justify-between gap-8">
            <div className="flex items-center gap-1 odd:border-pink-400">
              {component.tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex h-[24px] cursor-default select-none items-center justify-center gap-2 rounded-full border border-light3 px-2 text-xs text-light11 transition dark:border-dark3 dark:text-dark11"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-light12 transition dark:text-dark12">
            {component.info}
          </p>
        </article>
      </div>
    </div>
  )
}
