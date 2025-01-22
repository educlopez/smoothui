// @ts-nocheck
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { githubGist } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism"

import { Frappe } from "@/app/styles/catppuccinThemeFrappe"
import { Latte } from "@/app/styles/catppuccinThemeLatte"

type CodeProps = {
  code: string
  lang?: string
}

function Code({ code, lang = "tsx" }: CodeProps) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="animate-pulse rounded-lg border border-light3 bg-light1 p-4 dark:border-dark3 dark:bg-dark2">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-3/4 rounded bg-light3 dark:bg-dark3" />
          <div className="h-4 w-1/2 rounded bg-light3 dark:bg-dark3" />
          <div className="h-4 w-5/6 rounded bg-light3 dark:bg-dark3" />
          <div className="h-4 w-2/3 rounded bg-light3 dark:bg-dark3" />
        </div>
      </div>
    )
  }

  return (
    <SyntaxHighlighter
      language={lang}
      style={theme === "dark" ? Frappe : Latte}
      customStyle={{
        margin: 0,
        padding: "1rem",
        height: "100%",
        width: "100%",
        overflow: "auto",
        background: "transparent",
      }}
      wrapLongLines={true}
      showLineNumbers={true}
      className="rounded-lg border border-light3 bg-light1 transition dark:border-dark3 dark:bg-dark2"
    >
      {code}
    </SyntaxHighlighter>
  )
}

export default Code
