import type { ThemeRegistration } from "shiki";

/**
 * SmoothUI Light Theme
 * A pastel theme featuring SmoothUI's brand pink color
 * Based on catppuccin-latte structure with SmoothUI brand colors
 */
export const smoothuiLight: ThemeRegistration = {
  name: "smoothui-light",
  displayName: "SmoothUI Light",
  type: "light",
  colors: {
    "editor.background": "#fafafa",
    "editor.foreground": "#4c4f69",
    "editorLineNumber.foreground": "#9ca0b0",
    "editorLineNumber.activeForeground": "#e87aa4",
    "editor.selectionBackground": "#e87aa433",
    "editor.lineHighlightBackground": "#f5f5f5",
  },
  tokenColors: [
    // Base text and variables
    {
      scope: [
        "text",
        "source",
        "variable.other.readwrite",
        "punctuation.definition.variable",
      ],
      settings: { foreground: "#4c4f69" },
    },
    // Punctuation
    {
      scope: "punctuation",
      settings: { foreground: "#7c7f93" },
    },
    // Comments
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#9ca0b0", fontStyle: "italic" },
    },
    // Strings - SmoothUI brand pink
    {
      scope: ["string", "punctuation.definition.string"],
      settings: { foreground: "#e87aa4" },
    },
    // Escape characters - lavender
    {
      scope: "constant.character.escape",
      settings: { foreground: "#7287fd" },
    },
    // Numbers and constants - orange/peach
    {
      scope: [
        "constant.numeric",
        "variable.other.constant",
        "entity.name.constant",
        "constant.language.boolean",
        "constant.language.false",
        "constant.language.true",
        "keyword.other.unit.user-defined",
        "keyword.other.unit.suffix.floating-point",
      ],
      settings: { foreground: "#df8e1d" },
    },
    // Keywords - purple
    {
      scope: [
        "keyword",
        "keyword.operator.word",
        "keyword.operator.new",
        "variable.language.super",
        "support.type.primitive",
        "storage.type",
        "storage.modifier",
        "punctuation.definition.keyword",
      ],
      settings: { foreground: "#8839ef" },
    },
    // Documentation tags - purple
    {
      scope: "entity.name.tag.documentation",
      settings: { foreground: "#8839ef" },
    },
    // Operators - sky blue
    {
      scope: [
        "keyword.operator",
        "punctuation.accessor",
        "punctuation.definition.generic",
        "meta.function.closure punctuation.section.parameters",
        "punctuation.definition.tag",
        "punctuation.separator.key-value",
      ],
      settings: { foreground: "#04a5e5" },
    },
    // Functions - soft blue
    {
      scope: [
        "entity.name.function",
        "meta.function-call.method",
        "support.function",
        "support.function.misc",
        "variable.function",
      ],
      settings: { foreground: "#1e66f5", fontStyle: "italic" },
    },
    // Classes and structs - lavender
    {
      scope: [
        "entity.name.class",
        "entity.other.inherited-class",
        "support.class",
        "meta.function-call.constructor",
        "entity.name.struct",
      ],
      settings: { foreground: "#7287fd", fontStyle: "italic" },
    },
    // Enums
    {
      scope: "entity.name.enum",
      settings: { foreground: "#7287fd", fontStyle: "italic" },
    },
    // Enum members - orange
    {
      scope: [
        "meta.enum variable.other.readwrite",
        "variable.other.enummember",
      ],
      settings: { foreground: "#df8e1d" },
    },
    // Object properties - teal
    {
      scope: "meta.property.object",
      settings: { foreground: "#179299" },
    },
    // Types - lavender
    {
      scope: [
        "meta.type",
        "meta.type-alias",
        "support.type",
        "entity.name.type",
      ],
      settings: { foreground: "#7287fd", fontStyle: "italic" },
    },
    // Decorators and annotations - pink
    {
      scope: [
        "meta.annotation variable.function",
        "meta.annotation variable.annotation.function",
        "meta.annotation punctuation.definition.annotation",
        "meta.decorator",
        "punctuation.decorator",
      ],
      settings: { foreground: "#e87aa4" },
    },
    // Parameters - darker pink/rose
    {
      scope: ["variable.parameter", "meta.function.parameters"],
      settings: { foreground: "#d66b96", fontStyle: "italic" },
    },
    // Built-in constants and functions - purple
    {
      scope: ["constant.language", "support.function.builtin"],
      settings: { foreground: "#8839ef" },
    },
    // Attribute documentation
    {
      scope: "entity.other.attribute-name.documentation",
      settings: { foreground: "#8839ef" },
    },
    // Directives - lavender
    {
      scope: ["keyword.control.directive", "punctuation.definition.directive"],
      settings: { foreground: "#7287fd" },
    },
    // Type parameters - sky blue
    {
      scope: "punctuation.definition.typeparameters",
      settings: { foreground: "#04a5e5" },
    },
    // Namespaces - lavender
    {
      scope: "entity.name.namespace",
      settings: { foreground: "#7287fd" },
    },
    // CSS properties - blue
    {
      scope: [
        "support.type.property-name.css",
        "support.type.property-name.less",
      ],
      settings: { foreground: "#1e66f5" },
    },
    // this keyword - purple
    {
      scope: [
        "variable.language.this",
        "variable.language.this punctuation.definition.variable",
      ],
      settings: { foreground: "#8839ef" },
    },
    // Object property
    {
      scope: "variable.object.property",
      settings: { foreground: "#4c4f69" },
    },
    // Template string variables
    {
      scope: ["string.template variable", "string variable"],
      settings: { foreground: "#4c4f69" },
    },
    // new keyword - bold
    {
      scope: "keyword.operator.new",
      settings: { fontStyle: "bold" },
    },
    // HTML tags - blue
    {
      scope: ["entity.name.tag"],
      settings: { foreground: "#1e66f5" },
    },
    // HTML entities - purple
    {
      scope: [
        "text.html constant.character.entity",
        "text.html constant.character.entity punctuation",
        "constant.character.entity.xml",
        "constant.character.entity.xml punctuation",
      ],
      settings: { foreground: "#8839ef" },
    },
    // HTML/JSX attributes - lavender
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#7287fd" },
    },
    // JSX/Vue components - pink
    {
      scope: [
        "support.class.component",
        "support.class.component.jsx",
        "support.class.component.tsx",
        "support.class.component.vue",
      ],
      settings: { foreground: "#e87aa4" },
    },
    // Java/TS annotations - pink
    {
      scope: ["punctuation.definition.annotation", "storage.type.annotation"],
      settings: { foreground: "#e87aa4" },
    },
    // JS/TS constants
    {
      scope: [
        "variable.other.constant.js",
        "variable.other.constant.ts",
        "variable.other.property.js",
        "variable.other.property.ts",
      ],
      settings: { foreground: "#4c4f69" },
    },
    // JSDoc variables - maroon
    {
      scope: [
        "variable.other.jsdoc",
        "comment.block.documentation variable.other",
      ],
      settings: { foreground: "#d66b96" },
    },
    // null/undefined - purple
    {
      scope: [
        "constant.language.null.js",
        "constant.language.null.ts",
        "constant.language.undefined.js",
        "constant.language.undefined.ts",
        "support.type.builtin.ts",
      ],
      settings: { foreground: "#8839ef" },
    },
    // Generic type parameter - lavender
    {
      scope: "variable.parameter.generic",
      settings: { foreground: "#7287fd" },
    },
    // Arrow functions - orange
    {
      scope: [
        "keyword.declaration.function.arrow.js",
        "storage.type.function.arrow.ts",
      ],
      settings: { foreground: "#df8e1d" },
    },
    // TypeScript decorator - blue italic
    {
      scope: "punctuation.decorator.ts",
      settings: { foreground: "#1e66f5", fontStyle: "italic" },
    },
    // Expression keywords - purple
    {
      scope: [
        "keyword.operator.expression.in.js",
        "keyword.operator.expression.in.ts",
        "keyword.operator.expression.infer.ts",
        "keyword.operator.expression.instanceof.js",
        "keyword.operator.expression.instanceof.ts",
        "keyword.operator.expression.is",
        "keyword.operator.expression.keyof.ts",
        "keyword.operator.expression.of.js",
        "keyword.operator.expression.of.ts",
        "keyword.operator.expression.typeof.ts",
      ],
      settings: { foreground: "#8839ef" },
    },
    // Python self - purple
    {
      scope: [
        "variable.parameter.function.language.special.self.python",
        "variable.language.special.self.python",
      ],
      settings: { foreground: "#8839ef", fontStyle: "italic" },
    },
    // Python decorators - sky blue
    {
      scope: [
        "support.token.decorator.python",
        "meta.function.decorator.identifier.python",
      ],
      settings: { foreground: "#04a5e5" },
    },
    // Python function calls - blue
    {
      scope: ["meta.function-call.python"],
      settings: { foreground: "#1e66f5" },
    },
    // Python decorator names - pink
    {
      scope: [
        "entity.name.function.decorator.python",
        "punctuation.definition.decorator.python",
      ],
      settings: { foreground: "#e87aa4", fontStyle: "italic" },
    },
    // Python format placeholders - lavender
    {
      scope: "constant.character.format.placeholder.other.python",
      settings: { foreground: "#7287fd" },
    },
    // Python exceptions and builtins - orange
    {
      scope: [
        "support.type.exception.python",
        "support.function.builtin.python",
      ],
      settings: { foreground: "#df8e1d" },
    },
    // Markdown headings
    {
      scope: [
        "heading.1.markdown punctuation.definition.heading.markdown",
        "heading.1.markdown",
        "markup.heading.atx.1.mdx",
        "markup.heading.atx.1.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#e87aa4" },
    },
    {
      scope: [
        "heading.2.markdown punctuation.definition.heading.markdown",
        "heading.2.markdown",
        "markup.heading.atx.2.mdx",
        "markup.heading.atx.2.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#8839ef" },
    },
    {
      scope: [
        "heading.3.markdown punctuation.definition.heading.markdown",
        "heading.3.markdown",
        "markup.heading.atx.3.mdx",
        "markup.heading.atx.3.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#7287fd" },
    },
    {
      scope: [
        "heading.4.markdown punctuation.definition.heading.markdown",
        "heading.4.markdown",
        "markup.heading.atx.4.mdx",
        "markup.heading.atx.4.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#1e66f5" },
    },
    {
      scope: [
        "heading.5.markdown punctuation.definition.heading.markdown",
        "heading.5.markdown",
        "markup.heading.atx.5.mdx",
        "markup.heading.atx.5.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#04a5e5" },
    },
    {
      scope: [
        "heading.6.markdown punctuation.definition.heading.markdown",
        "heading.6.markdown",
        "markup.heading.atx.6.mdx",
        "markup.heading.atx.6.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#7287fd" },
    },
    // Markdown bold - pink
    {
      scope: "markup.bold",
      settings: { foreground: "#e87aa4", fontStyle: "bold" },
    },
    // Markdown italic - pink
    {
      scope: "markup.italic",
      settings: { foreground: "#e87aa4", fontStyle: "italic" },
    },
    // Markdown strikethrough
    {
      scope: "markup.strikethrough",
      settings: { foreground: "#6c6f85", fontStyle: "strikethrough" },
    },
    // Markdown links - blue
    {
      scope: ["punctuation.definition.link", "markup.underline.link"],
      settings: { foreground: "#1e66f5" },
    },
    // Markdown link text - lavender
    {
      scope: [
        "text.html.markdown punctuation.definition.link.title",
        "string.other.link.title.markdown",
        "markup.link",
        "punctuation.definition.constant.markdown",
        "constant.other.reference.link.markdown",
      ],
      settings: { foreground: "#7287fd" },
    },
    // Markdown raw/code - pink
    {
      scope: [
        "punctuation.definition.raw.markdown",
        "markup.inline.raw.string.markdown",
        "markup.raw.block.markdown",
      ],
      settings: { foreground: "#e87aa4" },
    },
    // Markdown code block language - sky
    {
      scope: "fenced_code.block.language",
      settings: { foreground: "#04a5e5" },
    },
    // Markdown code block punctuation
    {
      scope: [
        "markup.fenced_code.block punctuation.definition",
        "markup.raw support.asciidoc",
      ],
      settings: { foreground: "#7c7f93" },
    },
    // Markdown quotes - pink
    {
      scope: ["markup.quote", "punctuation.definition.quote.begin"],
      settings: { foreground: "#e87aa4" },
    },
    // Markdown separator - teal
    {
      scope: "meta.separator.markdown",
      settings: { foreground: "#179299" },
    },
    // Markdown list bullets - teal
    {
      scope: [
        "punctuation.definition.list.begin.markdown",
        "markup.list.bullet",
      ],
      settings: { foreground: "#179299" },
    },
    // Diff colors
    {
      scope: "markup.changed.diff",
      settings: { foreground: "#7287fd" },
    },
    {
      scope: [
        "meta.diff.header.from-file",
        "meta.diff.header.to-file",
        "punctuation.definition.from-file.diff",
        "punctuation.definition.to-file.diff",
      ],
      settings: { foreground: "#1e66f5" },
    },
    {
      scope: "markup.inserted.diff",
      settings: { foreground: "#04a5e5" },
    },
    {
      scope: "markup.deleted.diff",
      settings: { foreground: "#d20f39" },
    },
    // JSON/YAML property names - blue
    {
      scope: [
        "keyword.other.definition.ini",
        "punctuation.support.type.property-name.json",
        "support.type.property-name.json",
        "punctuation.support.type.property-name.toml",
        "support.type.property-name.toml",
        "entity.name.tag.yaml",
        "punctuation.support.type.property-name.yaml",
        "support.type.property-name.yaml",
      ],
      settings: { foreground: "#1e66f5" },
    },
    // JSON/YAML constants - peach
    {
      scope: ["constant.language.json", "constant.language.yaml"],
      settings: { foreground: "#f5a97f" },
    },
    // Shell shebang - pink
    {
      scope: [
        "comment.line.shebang",
        "comment.line.shebang punctuation.definition.comment",
        "punctuation.definition.comment.shebang.shell",
        "meta.shebang.shell",
      ],
      settings: { foreground: "#e87aa4", fontStyle: "italic" },
    },
    // Rust storage types - pink
    {
      scope: [
        "entity.name.function.macro.rules.rust",
        "storage.type.module.rust",
        "storage.modifier.rust",
        "storage.type.struct.rust",
        "storage.type.enum.rust",
        "storage.type.trait.rust",
        "storage.type.union.rust",
        "storage.type.impl.rust",
        "storage.type.rust",
        "storage.type.function.rust",
        "storage.type.type.rust",
      ],
      settings: { foreground: "#e87aa4" },
    },
    // Rust numeric types - pink
    {
      scope: "entity.name.type.numeric.rust",
      settings: { foreground: "#e87aa4" },
    },
    // Rust macros - blue
    {
      scope: [
        "support.macro.rust",
        "meta.macro.rust support.function.rust",
        "entity.name.function.macro.rust",
      ],
      settings: { foreground: "#1e66f5", fontStyle: "italic" },
    },
    // Rust lifetimes - blue
    {
      scope: ["storage.modifier.lifetime.rust", "entity.name.type.lifetime"],
      settings: { foreground: "#1e66f5", fontStyle: "italic" },
    },
    // Rust self - purple
    {
      scope: "variable.language.self.rust",
      settings: { foreground: "#8839ef" },
    },
    // Regex
    {
      scope: [
        "string.regexp punctuation.definition.string.begin",
        "string.regexp punctuation.definition.string.end",
      ],
      settings: { foreground: "#e87aa4" },
    },
    {
      scope: "keyword.control.anchor.regexp",
      settings: { foreground: "#e87aa4" },
    },
    {
      scope: "string.regexp.ts",
      settings: { foreground: "#4c4f69" },
    },
    {
      scope: [
        "punctuation.definition.group.regexp",
        "keyword.other.back-reference.regexp",
      ],
      settings: { foreground: "#1e66f5" },
    },
    {
      scope: "punctuation.definition.character-class.regexp",
      settings: { foreground: "#7287fd" },
    },
    {
      scope: "constant.other.character-class.regexp",
      settings: { foreground: "#e87aa4" },
    },
    {
      scope: "keyword.operator.quantifier.regexp",
      settings: { foreground: "#179299" },
    },
    {
      scope: "constant.character.numeric.regexp",
      settings: { foreground: "#179299" },
    },
  ],
  semanticHighlighting: true,
  semanticTokenColors: {
    boolean: "#df8e1d",
    number: "#df8e1d",
    enumMember: "#df8e1d",
    "class:python": "#7287fd",
    "class.builtin:python": "#8839ef",
    "function.decorator:python": "#e87aa4",
    selfKeyword: "#8839ef",
    heading: "#e87aa4",
    "variable.defaultLibrary": "#d66b96",
    "type.defaultLibrary:go": "#8839ef",
  },
};
