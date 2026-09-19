"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type CodeBlockLanguage =
  | "bash"
  | "css"
  | "js"
  | "json"
  | "jsx"
  | "sh"
  | "shell"
  | "ts"
  | "tsx";

export type CodeBlockProps = {
  /** Additional CSS classes */
  className?: string;
  /** Source code to render */
  code: string;
  /** Show a copy-to-clipboard button */
  copyable?: boolean;
  /** Optional filename shown in the header */
  filename?: string;
  /** 1-indexed line numbers to visually highlight */
  highlightLines?: number[];
  /** Language used to select the tokeniser rules */
  language?: CodeBlockLanguage;
  /** Maximum height before the block scrolls, e.g. 320 or "20rem" */
  maxHeight?: number | string;
  /** Show the line number gutter */
  showLineNumbers?: boolean;
  /** Reveal the code with a typing animation */
  typing?: boolean;
  /** Typing speed in characters per second */
  typingSpeed?: number;
  /** Wrap long lines instead of scrolling horizontally */
  wrap?: boolean;
};

type TokenType =
  | "attr"
  | "comment"
  | "keyword"
  | "number"
  | "plain"
  | "punctuation"
  | "string"
  | "tag";

type Token = { type: TokenType; value: string };
type TokenRule = { regex: RegExp; type: TokenType };

const DEFAULT_LANGUAGE: CodeBlockLanguage = "tsx";
const DEFAULT_TYPING_SPEED = 40;
const COPY_RESET_MS = 2000;
const MS_PER_SECOND = 1000;
const VIEW_THRESHOLD = 0.2;

const LINE_COMMENT_RULE: TokenRule = { regex: /\/\/[^\n]*/y, type: "comment" };
const BLOCK_COMMENT_RULE: TokenRule = {
  regex: /\/\*[\s\S]*?\*\//y,
  type: "comment",
};
const HASH_COMMENT_RULE: TokenRule = { regex: /#[^\n]*/y, type: "comment" };
const STRING_RULE: TokenRule = {
  regex: /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/y,
  type: "string",
};
const NUMBER_RULE: TokenRule = { regex: /\b\d+(?:\.\d+)?\b/y, type: "number" };
const HEX_COLOR_RULE: TokenRule = {
  regex: /#[0-9a-fA-F]{3,8}\b/y,
  type: "number",
};
const JS_KEYWORD_RULE: TokenRule = {
  regex:
    /\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|throw|try|catch|finally|new|class|extends|implements|import|export|default|from|as|async|await|typeof|instanceof|in|of|void|null|undefined|true|false|this|super|type|interface|enum|public|private|protected|readonly|static|namespace|declare|never|unknown|any|string|number|boolean|object|symbol)\b/y,
  type: "keyword",
};
const JSX_TAG_RULE: TokenRule = { regex: /<\/?[A-Za-z][\w.]*/y, type: "tag" };
const JSX_ATTR_RULE: TokenRule = {
  regex: /\b[a-zA-Z_][\w-]*(?=\s*=)/y,
  type: "attr",
};
const PUNCTUATION_RULE: TokenRule = {
  regex: /[{}()[\];:,.<>=+\-*/%!&|^~?]/y,
  type: "punctuation",
};
const CSS_AT_RULE: TokenRule = { regex: /@[a-zA-Z-]+/y, type: "keyword" };
const CSS_PROPERTY_RULE: TokenRule = {
  regex: /\b[a-zA-Z-]+(?=\s*:)/y,
  type: "attr",
};
const JSON_KEYWORD_RULE: TokenRule = {
  regex: /\b(?:true|false|null)\b/y,
  type: "keyword",
};
const BASH_VARIABLE_RULE: TokenRule = {
  regex: /\$\{?\w+\}?/y,
  type: "number",
};
const BASH_FLAG_RULE: TokenRule = {
  regex: /(?:^|(?<=\s))--?[a-zA-Z][\w-]*/y,
  type: "attr",
};
const BASH_KEYWORD_RULE: TokenRule = {
  regex:
    /\b(?:if|then|else|elif|fi|for|do|done|while|case|esac|function|echo|export|cd|return|exit|local|set|source|pnpm|npm|yarn|git|sudo)\b/y,
  type: "keyword",
};

const RULES_JS: TokenRule[] = [
  LINE_COMMENT_RULE,
  BLOCK_COMMENT_RULE,
  STRING_RULE,
  JSX_TAG_RULE,
  JSX_ATTR_RULE,
  JS_KEYWORD_RULE,
  NUMBER_RULE,
  PUNCTUATION_RULE,
];
const RULES_CSS: TokenRule[] = [
  BLOCK_COMMENT_RULE,
  STRING_RULE,
  HEX_COLOR_RULE,
  CSS_AT_RULE,
  CSS_PROPERTY_RULE,
  NUMBER_RULE,
  PUNCTUATION_RULE,
];
const RULES_BASH: TokenRule[] = [
  HASH_COMMENT_RULE,
  STRING_RULE,
  BASH_VARIABLE_RULE,
  BASH_FLAG_RULE,
  BASH_KEYWORD_RULE,
  NUMBER_RULE,
  PUNCTUATION_RULE,
];
const RULES_JSON: TokenRule[] = [
  STRING_RULE,
  JSON_KEYWORD_RULE,
  NUMBER_RULE,
  PUNCTUATION_RULE,
];

const LANGUAGE_RULES: Record<CodeBlockLanguage, TokenRule[]> = {
  bash: RULES_BASH,
  css: RULES_CSS,
  js: RULES_JS,
  json: RULES_JSON,
  jsx: RULES_JS,
  sh: RULES_BASH,
  shell: RULES_BASH,
  ts: RULES_JS,
  tsx: RULES_JS,
};

const TOKEN_CLASS: Record<TokenType, string> = {
  attr: "text-blue-hover",
  comment: "text-muted-foreground italic",
  keyword: "text-blue",
  number: "text-amber-hover",
  plain: "text-foreground",
  punctuation: "text-foreground/70",
  string: "text-green",
  tag: "text-brand",
};

const getRules = (language: CodeBlockLanguage): TokenRule[] =>
  LANGUAGE_RULES[language] ?? RULES_JS;

const tokenize = (code: string, rules: TokenRule[]): Token[] => {
  const tokens: Token[] = [];
  let pos = 0;
  let plainBuffer = "";

  while (pos < code.length) {
    let matchedRule: TokenRule | undefined;
    let matchedValue = "";

    for (const rule of rules) {
      rule.regex.lastIndex = pos;
      const match = rule.regex.exec(code);
      const [matchedText] = match ?? [];
      if (matchedText && matchedText.length > 0) {
        matchedRule = rule;
        matchedValue = matchedText;
        break;
      }
    }

    if (matchedRule) {
      if (plainBuffer) {
        tokens.push({ type: "plain", value: plainBuffer });
        plainBuffer = "";
      }
      tokens.push({ type: matchedRule.type, value: matchedValue });
      pos += matchedValue.length;
    } else {
      plainBuffer += code[pos];
      pos += 1;
    }
  }

  if (plainBuffer) {
    tokens.push({ type: "plain", value: plainBuffer });
  }

  return tokens;
};

const sliceTokens = (tokens: Token[], charLimit: number): Token[] => {
  const result: Token[] = [];
  let consumed = 0;

  for (const token of tokens) {
    if (consumed >= charLimit) {
      break;
    }
    const remaining = charLimit - consumed;
    if (token.value.length <= remaining) {
      result.push(token);
      consumed += token.value.length;
    } else {
      result.push({ type: token.type, value: token.value.slice(0, remaining) });
      break;
    }
  }

  return result;
};

const splitTokensIntoLines = (tokens: Token[]): Token[][] => {
  const lines: Token[][] = [[]];

  for (const token of tokens) {
    const parts = token.value.split("\n");
    for (const [index, part] of parts.entries()) {
      if (index > 0) {
        lines.push([]);
      }
      if (part.length > 0) {
        lines.at(-1)?.push({ type: token.type, value: part });
      }
    }
  }

  return lines;
};

type CopyButtonProps = { code: string; reduceMotion: boolean };

const CopyButton = ({ code, reduceMotion }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), COPY_RESET_MS);
      })
      .catch(() => {
        // Clipboard API unavailable; the code remains manually selectable.
      });
  }, [code]);

  return (
    <SmoothButton
      aria-label={copied ? "Copied to clipboard" : "Copy code"}
      className="shrink-0 text-muted-foreground hover:text-foreground"
      onClick={handleCopy}
      size="icon-sm"
      variant="ghost"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          animate={{ opacity: 1, scale: 1 }}
          className="flex"
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: 0 } }
              : { opacity: 0, scale: 0.6 }
          }
          initial={
            reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }
          }
          key={copied ? "copied" : "idle"}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { bounce: 0.1, duration: 0.25, type: "spring" }
          }
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </motion.span>
      </AnimatePresence>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </SmoothButton>
  );
};

const CodeBlock = ({
  code,
  language = DEFAULT_LANGUAGE,
  filename,
  showLineNumbers = true,
  highlightLines,
  wrap = false,
  maxHeight,
  typing = false,
  typingSpeed = DEFAULT_TYPING_SPEED,
  copyable = true,
  className,
}: CodeBlockProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(!typing);

  const normalizedCode = useMemo(
    () => (code.endsWith("\n") ? code.slice(0, -1) : code),
    [code]
  );
  const highlightSet = useMemo(
    () => new Set(highlightLines ?? []),
    [highlightLines]
  );
  const fullTokens = useMemo(
    () => tokenize(normalizedCode, getRules(language)),
    [normalizedCode, language]
  );
  const [revealedCount, setRevealedCount] = useState(
    typing ? 0 : normalizedCode.length
  );

  useEffect(() => {
    if (!typing) {
      return;
    }
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold: VIEW_THRESHOLD }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [typing]);

  useEffect(() => {
    if (!typing || shouldReduceMotion) {
      setRevealedCount(normalizedCode.length);
      return;
    }
    if (!inView) {
      return;
    }

    setRevealedCount(0);
    let frameId = 0;
    let startTime: number | null = null;
    const charsPerMs = typingSpeed / MS_PER_SECOND;

    const tick = (time: number) => {
      if (startTime === null) {
        startTime = time;
      }
      const elapsed = time - startTime;
      const next = Math.min(
        normalizedCode.length,
        Math.floor(elapsed * charsPerMs)
      );
      setRevealedCount(next);
      if (next < normalizedCode.length) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [typing, shouldReduceMotion, inView, normalizedCode, typingSpeed]);

  const visibleTokens = typing
    ? sliceTokens(fullTokens, revealedCount)
    : fullTokens;
  const lines = useMemo(
    () => splitTokensIntoLines(visibleTokens),
    [visibleTokens]
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-muted/30",
        className
      )}
      ref={containerRef}
    >
      {filename || copyable ? (
        <div className="flex items-center justify-between gap-3 border-border border-b bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-2 overflow-hidden text-muted-foreground text-xs">
            {filename ? (
              <span className="truncate font-medium text-foreground">
                {filename}
              </span>
            ) : null}
            <span className="shrink-0 uppercase tracking-wide">{language}</span>
          </div>
          {copyable ? (
            <CopyButton code={code} reduceMotion={shouldReduceMotion} />
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(!wrap && "overflow-x-auto")}
        style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
      >
        <pre
          className={cn(
            "m-0 py-3 text-[13px] leading-relaxed",
            wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre"
          )}
        >
          <code>
            {lines.map((lineTokens, lineIndex) => {
              const lineNumber = lineIndex + 1;
              const isHighlighted = highlightSet.has(lineNumber);
              return (
                <div
                  className={cn(
                    "flex gap-3 border-transparent border-l-2 px-3",
                    // Legibility first: the code sitting on a highlighted line
                    // must keep its full contrast, so the surface barely moves
                    // and the accent lives entirely in the gutter rail plus a
                    // line number promoted to full strength.
                    isHighlighted &&
                      "border-brand bg-foreground/[0.045] dark:bg-foreground/[0.07]"
                  )}
                  // biome-ignore lint/suspicious/noArrayIndexKey: lines map 1:1 to their position
                  key={lineIndex}
                >
                  {showLineNumbers ? (
                    <span
                      className={cn(
                        "w-6 shrink-0 select-none text-right tabular-nums",
                        isHighlighted
                          ? "text-foreground/80"
                          : "text-muted-foreground/60"
                      )}
                    >
                      {lineNumber}
                    </span>
                  ) : null}
                  <span className="flex-1">
                    {lineTokens.length === 0
                      ? " "
                      : lineTokens.map((token, tokenIndex) => (
                          <span
                            className={TOKEN_CLASS[token.type]}
                            // biome-ignore lint/suspicious/noArrayIndexKey: tokens map 1:1 to their position within a line
                            key={tokenIndex}
                          >
                            {token.value}
                          </span>
                        ))}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
