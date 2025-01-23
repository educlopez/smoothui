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
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Use resolvedTheme to determine the initial theme
  const currentTheme = mounted ? theme : resolvedTheme

  if (!mounted) {
    return (
      <div className="border-light3 bg-light1 dark:border-dark3 dark:bg-dark2 animate-pulse rounded-lg border p-4">
        <div className="flex flex-col gap-2">
          <div className="bg-light3 dark:bg-dark3 h-4 w-3/4 rounded-sm" />
          <div className="bg-light3 dark:bg-dark3 h-4 w-1/2 rounded-sm" />
          <div className="bg-light3 dark:bg-dark3 h-4 w-5/6 rounded-sm" />
          <div className="bg-light3 dark:bg-dark3 h-4 w-2/3 rounded-sm" />
        </div>
      </div>
    )
  }

  return (
    <SyntaxHighlighter
      language={lang}
      style={currentTheme === "dark" ? Frappe : Latte}
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
      className="border-light3 bg-light1 dark:border-dark3 dark:bg-dark2 rounded-lg border transition"
    >
      {code}
    </SyntaxHighlighter>
  )
}

export default Code
