// @ts-nocheck
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"

import { Frappe } from "@/app/styles/catppuccinThemeFrappe"

type CodeProps = {
  code: string
  lang?: string
}

function Code({ code, lang = "tsx" }: CodeProps) {
  return (
    <SyntaxHighlighter
      language={lang}
      style={Frappe}
      customStyle={{
        margin: 0,
        padding: "1rem",
        height: "100%",
        width: "100%",
        overflow: "auto",
      }}
      wrapLongLines={true}
      showLineNumbers={true}
      className="bg-dark-300 font-code rounded-lg"
    >
      {code}
    </SyntaxHighlighter>
  )
}

export default Code
