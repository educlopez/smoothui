const colors = {
  // Catppuccin Latte palette
  rosewater: "#dc8a78",
  flamingo: "#dd7878",
  pink: "#ea76cb",
  mauve: "#8839ef",
  red: "#d20f39",
  maroon: "#e64553",
  peach: "#fe640b",
  yellow: "#df8e1d",
  green: "#40a02b",
  teal: "#179299",
  sky: "#04a5e5",
  sapphire: "#209fb5",
  blue: "#1e66f5",
  lavender: "#7287fd",
  text: "#4c4f69",
  subtext1: "#5c5f77",
  subtext0: "#6c6f85",
  overlay2: "#7c7f93",
  overlay1: "#8c8fa1",
  overlay0: "#9ca0b0",
  surface2: "#acb0be",
  surface1: "#bcc0cc",
  surface0: "#ccd0da",
  base: "#eff1f5",
  mantle: "#e6e9ef",
  crust: "#dce0e8",
}

export const Latte = {
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
