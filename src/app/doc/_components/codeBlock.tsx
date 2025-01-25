"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, CodeIcon, TerminalIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import Code from "@/app/doc/_components/code"
import { CopyCode } from "@/app/doc/_components/copyCode"
import { cn } from "@/app/utils/cn"

type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

const packageManagers: Record<PackageManager, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
}

type CodeBlockProps = {
  code: string
  fileName?: string
  lang?: string
  copyCode?: boolean
  collapsible?: boolean
} & React.ComponentProps<"div">

export function CodeBlock({
  code,
  fileName,
  className,
  lang,
  copyCode = true,
  collapsible = false,
}: CodeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedPM, setSelectedPM] = useState<PackageManager>("npm")
  const codeRef = useRef<HTMLDivElement>(null)
  const [shouldShowButton, setShouldShowButton] = useState(false)
  const maxHeight = 500

  useEffect(() => {
    if (collapsible && codeRef.current) {
      const shouldShow = codeRef.current.scrollHeight > maxHeight
      setShouldShowButton(shouldShow)
    }
  }, [code, collapsible])

  const getProcessedCode = (originalCode: string) => {
    if (fileName === "Terminal") {
      // Split the code into lines
      const lines = originalCode.split("\n")

      // Process each line
      const processedLines = lines.map((line) => {
        // Only process non-empty lines
        if (line.trim()) {
          // Split the line into words
          const words = line.split(" ")
          // If the first word is a package manager command, replace it
          if (
            words[0] === "npm" ||
            words[0] === "pnpm" ||
            words[0] === "yarn" ||
            words[0] === "bun"
          ) {
            // Replace the first word with selected package manager
            words[0] = selectedPM
            // Replace 'install' with the correct command
            if (words[1] === "install") {
              words[1] = selectedPM === "npm" ? "install" : "add"
            }
          }
          return words.join(" ")
        }
        return line
      })

      return processedLines.join("\n")
    }
    return originalCode
  }

  return (
    <div
      className={cn(
        "border-light-200 bg-light-100 dark:border-dark-200 dark:bg-dark-100 relative overflow-hidden rounded-xl border",
        className
      )}
    >
      {fileName && copyCode && (
        <div className="border-light-200 bg-light-100 dark:border-dark-200 dark:bg-dark-300 flex h-10 items-center justify-between border-b px-4">
          <div className="flex items-center gap-1.5">
            {fileName === "Terminal" ? (
              <>
                <TerminalIcon
                  size={14}
                  className="text-light-800 dark:text-dark-800"
                />
                <div className="flex items-center gap-2">
                  <h3
                    data-table-content={fileName}
                    data-level="3"
                    className="text-light-900 dark:text-dark-900 text-[13px] leading-none font-medium"
                  >
                    {fileName}
                  </h3>
                  <select
                    value={selectedPM}
                    onChange={(e) =>
                      setSelectedPM(e.target.value as PackageManager)
                    }
                    className="border-light-200 bg-light-50 text-light-900 dark:border-dark-200 dark:bg-dark-50 dark:text-dark-900 ml-2 rounded-md border px-2 py-0.5 text-xs"
                  >
                    {Object.keys(packageManagers).map((pm) => (
                      <option key={pm} value={pm}>
                        {pm}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <CodeIcon
                  size={14}
                  className="text-light-800 dark:text-dark-800"
                />
                <h3
                  data-table-content={fileName}
                  data-level="3"
                  className="text-light-900 dark:text-dark-900 text-[13px] leading-none font-medium"
                >
                  {fileName}
                </h3>
              </>
            )}
          </div>
          <CopyCode code={getProcessedCode(code)} />
        </div>
      )}
      <motion.div
        ref={codeRef}
        className="relative overflow-x-auto"
        initial={{ height: collapsible ? maxHeight : "auto" }}
        animate={{
          height: shouldShowButton && !isExpanded ? maxHeight : "auto",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4">
          <Code code={getProcessedCode(code)} lang={lang} />
        </div>
      </motion.div>

      <AnimatePresence>
        {collapsible && shouldShowButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="from-dark-100 pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t pt-32 pb-8"
          >
            <button
              type="button"
              className="text-dark-900 hover:text-dark-950 pointer-events-auto relative flex flex-row items-center gap-2 text-sm"
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Show All <ChevronDown size={16} />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
