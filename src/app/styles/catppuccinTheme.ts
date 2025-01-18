const colors = {
  // Catppuccin Mocha palette
  rosewater: "#f5e0dc",
  flamingo: "#f2cdcd",
  pink: "#f5c2e7",
  mauve: "#cba6f7",
  red: "#f38ba8",
  maroon: "#eba0ac",
  peach: "#fab387",
  yellow: "#f9e2af",
  green: "#a6e3a1",
  teal: "#94e2d5",
  sky: "#89dceb",
  sapphire: "#74c7ec",
  blue: "#89b4fa",
  lavender: "#b4befe",
  text: "#cdd6f4",
  subtext1: "#bac2de",
  subtext0: "#a6adc8",
  overlay2: "#9399b2",
  overlay1: "#7f849c",
  overlay0: "#6c7086",
  surface2: "#585b70",
  surface1: "#45475a",
  surface0: "#313244",
  base: "#1e1e2e",
  mantle: "#181825",
  crust: "#11111b",
}

export const catppuccinTheme = {
  'code[class*="language-"]': {
    color: colors.text,
    background: "none",
    fontFamily: "var(--font-mono)",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    tabSize: 4,
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: colors.text,
    background: colors.base,
    fontFamily: "var(--font-mono)",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.5",
    tabSize: 4,
    hyphens: "none",
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
    borderRadius: "0.3em",
  },
  comment: {
    color: colors.overlay0,
    fontStyle: "italic",
  },
  prolog: {
    color: colors.overlay0,
  },
  doctype: {
    color: colors.overlay0,
  },
  cdata: {
    color: colors.overlay0,
  },
  punctuation: {
    color: colors.subtext1,
  },
  namespace: {
    opacity: 0.7,
  },
  property: {
    color: colors.mauve,
  },
  tag: {
    color: colors.red,
  },
  constant: {
    color: colors.peach,
  },
  symbol: {
    color: colors.peach,
  },
  deleted: {
    color: colors.red,
  },
  boolean: {
    color: colors.peach,
  },
  number: {
    color: colors.peach,
  },
  selector: {
    color: colors.green,
  },
  "attr-name": {
    color: colors.peach,
  },
  string: {
    color: colors.green,
  },
  char: {
    color: colors.green,
  },
  builtin: {
    color: colors.peach,
  },
  inserted: {
    color: colors.green,
  },
  operator: {
    color: colors.sky,
  },
  entity: {
    color: colors.peach,
    cursor: "help",
  },
  url: {
    color: colors.teal,
  },
  variable: {
    color: colors.red,
  },
  atrule: {
    color: colors.mauve,
  },
  "attr-value": {
    color: colors.teal,
  },
  function: {
    color: colors.blue,
  },
  "class-name": {
    color: colors.yellow,
  },
  keyword: {
    color: colors.mauve,
  },
  regex: {
    color: colors.peach,
  },
  important: {
    color: colors.red,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
}
