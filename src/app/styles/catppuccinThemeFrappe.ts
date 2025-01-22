const colors = {
  // Catppuccin Frappé palette
  rosewater: "#f2d5cf",
  flamingo: "#eebebe",
  pink: "#f4b8e4",
  mauve: "#ca9ee6",
  red: "#e78284",
  maroon: "#ea999c",
  peach: "#ef9f76",
  yellow: "#e5c890",
  green: "#a6d189",
  teal: "#81c8be",
  sky: "#99d1db",
  sapphire: "#85c1dc",
  blue: "#8caaee",
  lavender: "#babbf1",
  text: "#c6d0f5",
  subtext1: "#b5bfe2",
  subtext0: "#a5adce",
  overlay2: "#949cbb",
  overlay1: "#838ba7",
  overlay0: "#737994",
  surface2: "#626880",
  surface1: "#51576d",
  surface0: "#414559",
  base: "#303446",
  mantle: "#292c3c",
  crust: "#232634",
}

export const Frappe = {
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
