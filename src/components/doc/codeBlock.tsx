import { CodeIcon, TerminalIcon } from "lucide-react"

import Code from "@/components/doc/code"
import { CopyCode } from "@/components/doc/copyCode"
import { cn } from "@/components/smoothui/utils/cn"

type CodeBlockProps = {
  code: string
  fileName?: string
  lang?: string
  copyCode?: boolean
  installCommand?: string
} & React.ComponentProps<"div">

export function CodeBlock({
  code,
  fileName,
  className,
  lang,
  copyCode = true,
  installCommand,
}: CodeBlockProps) {
  // Concatenate the install command with the code
  const combinedCode = installCommand ? `${installCommand} ${code}` : code

  return (
    <div
      className={cn(
        "bg-primary relative overflow-hidden rounded-lg border",
        className
      )}
    >
      {fileName && copyCode && (
        <div className="bg-primary flex h-10 items-center justify-between border-b px-4">
          <div className="flex items-center gap-1.5">
            {fileName === "Terminal" ? (
              <>
                <TerminalIcon size={14} className="text-primary-foreground" />
                <div className="flex items-center gap-2">
                  <h3
                    data-table-content={fileName}
                    data-level="3"
                    className="text-foreground text-[13px] leading-none font-medium"
                  >
                    {fileName}
                  </h3>
                </div>
              </>
            ) : (
              <>
                <CodeIcon size={14} className="text-primary-foreground" />
                <h3
                  data-table-content={fileName}
                  data-level="3"
                  className="text-foreground text-[13px] leading-none font-medium"
                >
                  {fileName}
                </h3>
              </>
            )}
          </div>
          {fileName === "Terminal" ? (
            <CopyCode code={combinedCode} />
          ) : (
            <CopyCode code={code} />
          )}
        </div>
      )}
      <div className="relative overflow-x-auto">
        <div className="p-4">
          {fileName === "Terminal" ? (
            <Code code={combinedCode} lang={lang} />
          ) : (
            <Code code={code} lang={lang} />
          )}
        </div>
      </div>
    </div>
  )
}
