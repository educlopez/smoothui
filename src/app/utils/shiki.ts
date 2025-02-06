import { createHighlighter } from "shiki"

type CodeProps = {
  code: string
  lang?: string
}

export async function codeToHtml({ code, lang = "tsx" }: CodeProps) {
  const highlighter = await createHighlighter({
    themes: ["catppuccin-frappe", "github-light"],
    langs: [lang],
  })

  return highlighter.codeToHtml(code, {
    lang: lang,
    themes: {
      dark: "catppuccin-frappe",
      light: "github-light",
    },
    defaultColor: false,
    cssVariablePrefix: "--_s-",
  })
}
