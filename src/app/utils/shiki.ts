import { createHighlighter, type Highlighter } from "shiki"

let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter(lang: string) {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["catppuccin-frappe", "github-light"],
      langs: [lang],
    })
  }
  const highlighter = await highlighterPromise
  // Optionally, load additional languages if needed
  if (!highlighter.getLoadedLanguages().includes(lang)) {
    await highlighter.loadLanguage(lang as any)
  }
  return highlighter
}

type CodeProps = {
  code: string
  lang?: string
}

export async function codeToHtml({ code, lang = "tsx" }: CodeProps) {
  const highlighter = await getHighlighter(lang)
  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      dark: "catppuccin-frappe",
      light: "github-light",
    },
    defaultColor: false,
    cssVariablePrefix: "--_s-",
  })
}
