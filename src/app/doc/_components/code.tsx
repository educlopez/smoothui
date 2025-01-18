// @ts-nocheck
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

import { catppuccinTheme } from "@/app/styles/catppuccinTheme"

type CodeProps = {
  code: string
  lang?: string
}

function Code({ code, lang = "tsx" }: CodeProps) {
  return (
    <SyntaxHighlighter
      language={lang}
      style={catppuccinTheme}
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
