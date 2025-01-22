// @ts-nocheck
import { useTheme } from "next-themes"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism"

import { Frappe } from "@/app/styles/catppuccinThemeFrappe"
import { Latte } from "@/app/styles/catppuccinThemeLatte"

type CodeProps = {
  code: string
  lang?: string
}

function Code({ code, lang = "tsx" }: CodeProps) {
  const { theme } = useTheme()
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
