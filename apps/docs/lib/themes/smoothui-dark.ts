import type { ThemeRegistration } from "shiki";

/**
 * SmoothUI Dark Theme
 * A pastel dark theme featuring SmoothUI's brand pink color
 * Based on catppuccin-mocha structure with SmoothUI brand colors
 */
export const smoothuiDark: ThemeRegistration = {
  name: "smoothui-dark",
  displayName: "SmoothUI Dark",
  type: "dark",
  colors: {
    "editor.background": "#1a1a1a",
    "editor.foreground": "#e4e4e7",
    "editorLineNumber.foreground": "#6c7086",
    "editorLineNumber.activeForeground": "#f0a4bc",
    "editor.selectionBackground": "#f0a4bc33",
    "editor.lineHighlightBackground": "#262626",
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
      settings: { foreground: "#e4e4e7" },
    },
    // Punctuation
    {
      scope: "punctuation",
      settings: { foreground: "#9399b2" },
    },
    // Comments
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#6c7086", fontStyle: "italic" },
    },
    // Strings - SmoothUI brand pink
    {
      scope: ["string", "punctuation.definition.string"],
      settings: { foreground: "#f0a4bc" },
    },
    // Escape characters - lavender
    {
      scope: "constant.character.escape",
      settings: { foreground: "#b4befe" },
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
      settings: { foreground: "#fab387" },
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
      settings: { foreground: "#cba6f7" },
    },
    // Documentation tags - purple
    {
      scope: "entity.name.tag.documentation",
      settings: { foreground: "#cba6f7" },
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
      settings: { foreground: "#89dceb" },
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
      settings: { foreground: "#89b4fa", fontStyle: "italic" },
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
      settings: { foreground: "#b4befe", fontStyle: "italic" },
    },
    // Enums
    {
      scope: "entity.name.enum",
      settings: { foreground: "#b4befe", fontStyle: "italic" },
    },
    // Enum members - orange
    {
      scope: [
        "meta.enum variable.other.readwrite",
        "variable.other.enummember",
      ],
      settings: { foreground: "#fab387" },
    },
    // Object properties - teal
    {
      scope: "meta.property.object",
      settings: { foreground: "#94e2d5" },
    },
    // Types - lavender
    {
      scope: [
        "meta.type",
        "meta.type-alias",
        "support.type",
        "entity.name.type",
      ],
      settings: { foreground: "#b4befe", fontStyle: "italic" },
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
      settings: { foreground: "#f0a4bc" },
    },
    // Parameters - darker pink/rose
    {
      scope: ["variable.parameter", "meta.function.parameters"],
      settings: { foreground: "#eba0ac", fontStyle: "italic" },
    },
    // Built-in constants and functions - purple
    {
      scope: ["constant.language", "support.function.builtin"],
      settings: { foreground: "#cba6f7" },
    },
    // Attribute documentation
    {
      scope: "entity.other.attribute-name.documentation",
      settings: { foreground: "#cba6f7" },
    },
    // Directives - lavender
    {
      scope: ["keyword.control.directive", "punctuation.definition.directive"],
      settings: { foreground: "#b4befe" },
    },
    // Type parameters - sky blue
    {
      scope: "punctuation.definition.typeparameters",
      settings: { foreground: "#89dceb" },
    },
    // Namespaces - lavender
    {
      scope: "entity.name.namespace",
      settings: { foreground: "#b4befe" },
    },
    // CSS properties - blue
    {
      scope: [
        "support.type.property-name.css",
        "support.type.property-name.less",
      ],
      settings: { foreground: "#89b4fa" },
    },
    // this keyword - purple
    {
      scope: [
        "variable.language.this",
        "variable.language.this punctuation.definition.variable",
      ],
      settings: { foreground: "#cba6f7" },
    },
    // Object property
    {
      scope: "variable.object.property",
      settings: { foreground: "#e4e4e7" },
    },
    // Template string variables
    {
      scope: ["string.template variable", "string variable"],
      settings: { foreground: "#e4e4e7" },
    },
    // new keyword - bold
    {
      scope: "keyword.operator.new",
      settings: { fontStyle: "bold" },
    },
    // HTML tags - blue
    {
      scope: ["entity.name.tag"],
      settings: { foreground: "#89b4fa" },
    },
    // HTML entities - purple
    {
      scope: [
        "text.html constant.character.entity",
        "text.html constant.character.entity punctuation",
        "constant.character.entity.xml",
        "constant.character.entity.xml punctuation",
      ],
      settings: { foreground: "#cba6f7" },
    },
    // HTML/JSX attributes - lavender
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#b4befe" },
    },
    // JSX/Vue components - pink
    {
      scope: [
        "support.class.component",
        "support.class.component.jsx",
        "support.class.component.tsx",
        "support.class.component.vue",
      ],
      settings: { foreground: "#f0a4bc" },
    },
    // Java/TS annotations - pink
    {
      scope: ["punctuation.definition.annotation", "storage.type.annotation"],
      settings: { foreground: "#f0a4bc" },
    },
    // JS/TS constants
    {
      scope: [
        "variable.other.constant.js",
        "variable.other.constant.ts",
        "variable.other.property.js",
        "variable.other.property.ts",
      ],
      settings: { foreground: "#e4e4e7" },
    },
    // JSDoc variables - maroon
    {
      scope: [
        "variable.other.jsdoc",
        "comment.block.documentation variable.other",
      ],
      settings: { foreground: "#eba0ac" },
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
      settings: { foreground: "#cba6f7" },
    },
    // Generic type parameter - lavender
    {
      scope: "variable.parameter.generic",
      settings: { foreground: "#b4befe" },
    },
    // Arrow functions - orange
    {
      scope: [
        "keyword.declaration.function.arrow.js",
        "storage.type.function.arrow.ts",
      ],
      settings: { foreground: "#fab387" },
    },
    // TypeScript decorator - blue italic
    {
      scope: "punctuation.decorator.ts",
      settings: { foreground: "#89b4fa", fontStyle: "italic" },
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
      settings: { foreground: "#cba6f7" },
    },
    // Python self - purple
    {
      scope: [
        "variable.parameter.function.language.special.self.python",
        "variable.language.special.self.python",
      ],
      settings: { foreground: "#cba6f7", fontStyle: "italic" },
    },
    // Python decorators - sky blue
    {
      scope: [
        "support.token.decorator.python",
        "meta.function.decorator.identifier.python",
      ],
      settings: { foreground: "#89dceb" },
    },
    // Python function calls - blue
    {
      scope: ["meta.function-call.python"],
      settings: { foreground: "#89b4fa" },
    },
    // Python decorator names - pink
    {
      scope: [
        "entity.name.function.decorator.python",
        "punctuation.definition.decorator.python",
      ],
      settings: { foreground: "#f0a4bc", fontStyle: "italic" },
    },
    // Python format placeholders - lavender
    {
      scope: "constant.character.format.placeholder.other.python",
      settings: { foreground: "#b4befe" },
    },
    // Python exceptions and builtins - orange
    {
      scope: [
        "support.type.exception.python",
        "support.function.builtin.python",
      ],
      settings: { foreground: "#fab387" },
    },
    // Markdown headings
    {
      scope: [
        "heading.1.markdown punctuation.definition.heading.markdown",
        "heading.1.markdown",
        "markup.heading.atx.1.mdx",
        "markup.heading.atx.1.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#f0a4bc" },
    },
    {
      scope: [
        "heading.2.markdown punctuation.definition.heading.markdown",
        "heading.2.markdown",
        "markup.heading.atx.2.mdx",
        "markup.heading.atx.2.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#cba6f7" },
    },
    {
      scope: [
        "heading.3.markdown punctuation.definition.heading.markdown",
        "heading.3.markdown",
        "markup.heading.atx.3.mdx",
        "markup.heading.atx.3.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#b4befe" },
    },
    {
      scope: [
        "heading.4.markdown punctuation.definition.heading.markdown",
        "heading.4.markdown",
        "markup.heading.atx.4.mdx",
        "markup.heading.atx.4.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#89b4fa" },
    },
    {
      scope: [
        "heading.5.markdown punctuation.definition.heading.markdown",
        "heading.5.markdown",
        "markup.heading.atx.5.mdx",
        "markup.heading.atx.5.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#89dceb" },
    },
    {
      scope: [
        "heading.6.markdown punctuation.definition.heading.markdown",
        "heading.6.markdown",
        "markup.heading.atx.6.mdx",
        "markup.heading.atx.6.mdx punctuation.definition.heading.mdx",
      ],
      settings: { foreground: "#b4befe" },
    },
    // Markdown bold - pink
    {
      scope: "markup.bold",
      settings: { foreground: "#f0a4bc", fontStyle: "bold" },
    },
    // Markdown italic - pink
    {
      scope: "markup.italic",
      settings: { foreground: "#f0a4bc", fontStyle: "italic" },
    },
    // Markdown strikethrough
    {
      scope: "markup.strikethrough",
      settings: { foreground: "#a6adc8", fontStyle: "strikethrough" },
    },
    // Markdown links - blue
    {
      scope: ["punctuation.definition.link", "markup.underline.link"],
      settings: { foreground: "#89b4fa" },
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
      settings: { foreground: "#b4befe" },
    },
    // Markdown raw/code - pink
    {
      scope: [
        "punctuation.definition.raw.markdown",
        "markup.inline.raw.string.markdown",
        "markup.raw.block.markdown",
      ],
      settings: { foreground: "#f0a4bc" },
    },
    // Markdown code block language - sky
    {
      scope: "fenced_code.block.language",
      settings: { foreground: "#89dceb" },
    },
    // Markdown code block punctuation
    {
      scope: [
        "markup.fenced_code.block punctuation.definition",
        "markup.raw support.asciidoc",
      ],
      settings: { foreground: "#9399b2" },
    },
    // Markdown quotes - pink
    {
      scope: ["markup.quote", "punctuation.definition.quote.begin"],
      settings: { foreground: "#f0a4bc" },
    },
    // Markdown separator - teal
    {
      scope: "meta.separator.markdown",
      settings: { foreground: "#94e2d5" },
    },
    // Markdown list bullets - teal
    {
      scope: [
        "punctuation.definition.list.begin.markdown",
        "markup.list.bullet",
      ],
      settings: { foreground: "#94e2d5" },
    },
    // Diff colors
    {
      scope: "markup.changed.diff",
      settings: { foreground: "#b4befe" },
    },
    {
      scope: [
        "meta.diff.header.from-file",
        "meta.diff.header.to-file",
        "punctuation.definition.from-file.diff",
        "punctuation.definition.to-file.diff",
      ],
      settings: { foreground: "#89b4fa" },
    },
    {
      scope: "markup.inserted.diff",
      settings: { foreground: "#89dceb" },
    },
    {
      scope: "markup.deleted.diff",
      settings: { foreground: "#f38ba8" },
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
      settings: { foreground: "#89b4fa" },
    },
    // JSON/YAML constants - peach
    {
      scope: ["constant.language.json", "constant.language.yaml"],
      settings: { foreground: "#fab387" },
    },
    // Shell shebang - pink
    {
      scope: [
        "comment.line.shebang",
        "comment.line.shebang punctuation.definition.comment",
        "punctuation.definition.comment.shebang.shell",
        "meta.shebang.shell",
      ],
      settings: { foreground: "#f0a4bc", fontStyle: "italic" },
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
      settings: { foreground: "#f0a4bc" },
    },
    // Rust numeric types - pink
    {
      scope: "entity.name.type.numeric.rust",
      settings: { foreground: "#f0a4bc" },
    },
    // Rust macros - blue
    {
      scope: [
        "support.macro.rust",
        "meta.macro.rust support.function.rust",
        "entity.name.function.macro.rust",
      ],
      settings: { foreground: "#89b4fa", fontStyle: "italic" },
    },
    // Rust lifetimes - blue
    {
      scope: ["storage.modifier.lifetime.rust", "entity.name.type.lifetime"],
      settings: { foreground: "#89b4fa", fontStyle: "italic" },
    },
    // Rust self - purple
    {
      scope: "variable.language.self.rust",
      settings: { foreground: "#cba6f7" },
    },
    // Regex
    {
      scope: [
        "string.regexp punctuation.definition.string.begin",
        "string.regexp punctuation.definition.string.end",
      ],
      settings: { foreground: "#f0a4bc" },
    },
    {
      scope: "keyword.control.anchor.regexp",
      settings: { foreground: "#f0a4bc" },
    },
    {
      scope: "string.regexp.ts",
      settings: { foreground: "#e4e4e7" },
    },
    {
      scope: [
        "punctuation.definition.group.regexp",
        "keyword.other.back-reference.regexp",
      ],
      settings: { foreground: "#89b4fa" },
    },
    {
      scope: "punctuation.definition.character-class.regexp",
      settings: { foreground: "#b4befe" },
    },
    {
      scope: "constant.other.character-class.regexp",
      settings: { foreground: "#f0a4bc" },
    },
    {
      scope: "keyword.operator.quantifier.regexp",
      settings: { foreground: "#94e2d5" },
    },
    {
      scope: "constant.character.numeric.regexp",
      settings: { foreground: "#94e2d5" },
    },
  ],
  semanticHighlighting: true,
  semanticTokenColors: {
    boolean: "#fab387",
    number: "#fab387",
    enumMember: "#fab387",
    "class:python": "#b4befe",
    "class.builtin:python": "#cba6f7",
    "function.decorator:python": "#f0a4bc",
    selfKeyword: "#cba6f7",
    heading: "#f0a4bc",
    "variable.defaultLibrary": "#eba0ac",
    "type.defaultLibrary:go": "#cba6f7",
  },
};
