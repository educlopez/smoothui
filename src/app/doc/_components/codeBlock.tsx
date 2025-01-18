import { CodeIcon, TerminalIcon } from "lucide-react"

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
      <div className="relative overflow-x-auto p-4">
        <Code code={code} lang={lang} />
      </div>
    </div>
  )
}
