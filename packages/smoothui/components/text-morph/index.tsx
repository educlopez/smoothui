"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ElementType } from "react";
import { useMemo } from "react";

export type TextMorphMode = "characters" | "words";
export type TextMorphAlign = "start" | "center" | "end";
export type TextMorphTag = "span" | "div" | "p" | "h1" | "h2" | "h3" | "h4";

export interface TextMorphProps {
  /** Justifies the token row when the wrapper is wider than the text. */
  align?: TextMorphAlign;
  /** Element rendered for the wrapper. */
  as?: TextMorphTag;
  className?: string;
  /** Spring duration for each token, in milliseconds. */
  duration?: number;
  /** Splits the diff on graphemes or whole words. */
  mode?: TextMorphMode;
  /** Per-token stagger, in milliseconds. Capped so long strings stay snappy. */
  stagger?: number;
  /** The current string. Changing it triggers the morph. */
  text: string;
}

interface TextMorphToken {
  key: string;
  value: string;
}

const DEFAULT_DURATION = 250;
const DEFAULT_STAGGER = 16;
const MS = 1000;
const POP_SCALE = 0.72;
const POP_OFFSET = 6;
const MAX_STAGGER_MS = 260;
const EXIT_DURATION_S = 0.15;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const ALIGN_CLASS: Record<TextMorphAlign, string> = {
  center: "justify-center",
  end: "justify-end",
  start: "justify-start",
};

const segmentGraphemes = (value: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return Array.from(segmenter.segment(value), (entry) => entry.segment);
  }
  return [...value];
};

const tokenizeText = (text: string, mode: TextMorphMode): string[] =>
  mode === "words"
    ? text.split(/(\s+)/).filter((token) => token.length > 0)
    : segmentGraphemes(text);

const buildTokens = (text: string, mode: TextMorphMode): TextMorphToken[] => {
  const occurrences = new Map<string, number>();
  return tokenizeText(text, mode).map((value) => {
    const count = occurrences.get(value) ?? 0;
    occurrences.set(value, count + 1);
    return {
      key: `${value}-${count}`,
      value,
    };
  });
};

/**
 * TextMorph — morphs one string into another by diffing tokens: shared
 * tokens keep their key and slide to their new position via layout
 * animation, removed tokens shrink out, added tokens pop in.
 *
 * The token row is `position: relative` on purpose: `AnimatePresence`
 * in `popLayout` mode pulls exiting tokens out of the flow with
 * `position: absolute`, so without a positioned parent they would resolve
 * against the page and fly off into a corner of the viewport.
 */
export default function TextMorph({
  text,
  align = "start",
  as = "span",
  className,
  duration = DEFAULT_DURATION,
  mode = "characters",
  stagger = DEFAULT_STAGGER,
}: TextMorphProps) {
  const shouldReduceMotion = useReducedMotion();
  const tokens = useMemo(() => buildTokens(text, mode), [text, mode]);
  const Tag = as as ElementType;

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {/*
       * The intact string is exposed as visually hidden text rather than an
       * `aria-label` on the wrapper: `aria-label` is prohibited on the generic
       * roles the default `as="span"` (and `as="div"`) produce, so screen
       * readers dropped it — and with every token marked `aria-hidden`, the
       * component announced nothing at all.
       */}
      <span className="sr-only">{text}</span>
      <motion.span
        className={cn("relative inline-flex flex-wrap", ALIGN_CLASS[align])}
        layout
        transition={{ bounce: 0.1, duration: duration / MS, type: "spring" }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {tokens.map((token, index) => (
            <motion.span
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-hidden="true"
              exit={{
                opacity: 0,
                scale: POP_SCALE,
                transition: { duration: EXIT_DURATION_S, ease: EASE_OUT },
                y: -POP_OFFSET,
              }}
              initial={{ opacity: 0, scale: POP_SCALE, y: POP_OFFSET }}
              key={token.key}
              layout
              style={{ display: "inline-block", whiteSpace: "pre" }}
              transition={{
                bounce: 0.1,
                delay: Math.min(index * stagger, MAX_STAGGER_MS) / MS,
                duration: duration / MS,
                type: "spring",
              }}
            >
              {token.value}
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.span>
    </Tag>
  );
}
