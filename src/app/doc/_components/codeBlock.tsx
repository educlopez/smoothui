"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, ChevronUp, CodeIcon, TerminalIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import Code from "@/app/doc/_components/code"
import { CopyCode } from "@/app/doc/_components/copyCode"
import { cn } from "@/app/utils/cn"

type CodeBlockProps = {
  code: string
  fileName?: string
  lang?: string
  copyCode?: boolean
} & React.ComponentProps<"div">

export function CodeBlock({
  code,
  fileName,
  className,
  lang,
  copyCode = true,
}: CodeBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)
  const [shouldShowButton, setShouldShowButton] = useState(false)
  const maxHeight = 500

  useEffect(() => {
    if (codeRef.current) {
      setShouldShowButton(codeRef.current.scrollHeight > maxHeight)
    }
  }, [code])

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-light3 bg-light2 dark:border-dark3 dark:bg-dark2",
        className
      )}
    >
      {fileName && copyCode && (
        <div className="flex h-10 items-center justify-between border-b border-light3 bg-light2 px-4 dark:border-dark3 dark:bg-dark4">
          <div className="flex items-center gap-1.5">
            {fileName === "Terminal" ? (
              <TerminalIcon
                size={14}
                className="text-light10 dark:text-dark10"
              />
            ) : (
              <CodeIcon size={14} className="text-light10 dark:text-dark10" />
            )}
            <h3 className="text-[13px] font-medium leading-none text-light11 dark:text-dark11">
              {fileName}
            </h3>
          </div>
          <CopyCode code={code} />
        </div>
      )}
      <motion.div
        ref={codeRef}
        className="relative overflow-x-auto"
        animate={{
          height: shouldShowButton && !isExpanded ? maxHeight : "auto",
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4">
          <Code code={code} lang={lang} />
        </div>
      </motion.div>

      <AnimatePresence>
        {shouldShowButton && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute bottom-0 left-0 flex w-full items-center justify-center gap-2 bg-gradient-to-t from-light2 p-2 text-sm text-light11 hover:text-light12 dark:from-dark2 dark:text-dark11 dark:hover:text-dark12"
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
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
