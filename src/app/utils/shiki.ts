import { createHighlighter } from "shiki"

type CodeProps = {
  code: string
  lang?: string
}

export async function codeToHtml({ code, lang = "tsx" }: CodeProps) {
  const highlighter = await createHighlighter({
    themes: ["catppuccin-frappe", "catppuccin-latte"],
    langs: [lang],
  })

  return highlighter.codeToHtml(code, {
    lang: lang,
    themes: {
      dark: "catppuccin-frappe",
      light: "catppuccin-latte",
    },
    defaultColor: false,
    cssVariablePrefix: "--_s-",
  })
}
