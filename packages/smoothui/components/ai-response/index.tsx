"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useRef } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/**
 * Hoisted and frozen. Motion restarts an animation whenever the transition it is
 * given changes, and this component re-renders on every token — so the object
 * has to be the same reference every time.
 */
const WORD_TRANSITION = { duration: 0.22, ease: EASE_OUT } as const;
const WORD_BLUR_PX = 4;
/** `[1]` style markers become citation pills. */
const CITATION_MARKER = /^\[(\d+)\]$/;
/**
 * Split on whitespace *and* on markers, so a marker is its own token even when
 * punctuation is glued to it — `compute [1],` has to yield `[1]` and `,`
 * separately or the pill never matches.
 */
const TOKEN_SPLIT = /(\s+|\[\d+\])/;
/** Anything without a letter or digit is punctuation and is not animated. */
const HAS_WORD_CHARACTER = /[\p{L}\p{N}]/u;
const WHITESPACE_ONLY = /^\s+$/;

export type AIResponseCitation = {
  id: string;
  /** The number shown in the pill, matching the `[n]` marker in the text. */
  index: number;
  title: string;
  /**
   * Where the source lives, when it lives anywhere.
   *
   * Optional on purpose: most retrieval is over internal documents that have no
   * public URL, and a required field there just pushes people into inventing
   * `example.com` links that go nowhere. Without a url the pill renders as plain
   * text instead of a dead link.
   */
  url?: string;
};

export type AIResponseProps = {
  /** Sources referenced by `[n]` markers in the text. */
  citations?: AIResponseCitation[];
  className?: string;
  /** Shows a caret after the last word. */
  isStreaming?: boolean;
  /** The response so far. Re-render it as it grows. */
  text: string;
};

type Token = {
  citation?: AIResponseCitation;
  value: string;
};

const tokenize = (text: string, citations: AIResponseCitation[]): Token[] =>
  text
    .split(TOKEN_SPLIT)
    .filter((value) => value !== "")
    .map((value) => {
      const match = value.match(CITATION_MARKER);
      if (!match) {
        return { value };
      }
      const index = Number(match[1]);
      const citation = citations.find((entry) => entry.index === index);
      return citation ? { citation, value } : { value };
    });

/**
 * Streaming assistant text.
 *
 * Words animate in as they *arrive*, not on a fixed timer — the component
 * remembers how many tokens it had last render and only animates the new ones.
 * A timer-driven typewriter drifts out of step with the real stream and starts
 * lying about how fast the model is answering.
 */
const AIResponse = ({
  citations = [],
  className,
  isStreaming = false,
  text,
}: AIResponseProps) => {
  const shouldReduceMotion = useReducedMotion();
  const tokens = tokenize(text, citations);

  // How many tokens had already been painted before this render. Everything at
  // or after this index is new and gets the entrance.
  const paintedRef = useRef(0);
  const firstNewIndex = paintedRef.current;

  useEffect(() => {
    paintedRef.current = tokens.length;
  }, [tokens.length]);

  return (
    <p
      className={cn(
        "text-pretty text-foreground text-sm leading-relaxed",
        className
      )}
    >
      {tokens.map((token, index) => {
        const isNew = index >= firstNewIndex;
        // Keyed by position only. Keying by text too would remount the last word
        // every time a token extends it, so it would re-animate on every frame of
        // the stream.
        const key = index;

        // Whitespace and bare punctuation stay as text. Wrapping a comma in its
        // own inline-block would let the line break between a word and its
        // punctuation.
        if (
          WHITESPACE_ONLY.test(token.value) ||
          !(token.citation || HAS_WORD_CHARACTER.test(token.value))
        ) {
          return <Fragment key={key}>{token.value}</Fragment>;
        }

        if (token.citation) {
          return (
            <AIResponseCitationPill
              citation={token.citation}
              isNew={isNew}
              key={key}
              shouldReduceMotion={Boolean(shouldReduceMotion)}
            />
          );
        }

        return (
          <motion.span
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            className="inline-block"
            initial={
              isNew && !shouldReduceMotion
                ? { filter: `blur(${WORD_BLUR_PX}px)`, opacity: 0, y: 2 }
                : false
            }
            key={key}
            // No stagger delay, deliberately. The transition object has to stay
            // identical across renders: a delay derived from the render-time
            // index goes negative as the text grows, and the entrance then never
            // resolves — words stay blurred forever. Token arrival is the stagger.
            transition={shouldReduceMotion ? { duration: 0 } : WORD_TRANSITION}
          >
            {token.value}
          </motion.span>
        );
      })}
      {isStreaming ? (
        <AIResponseCaret shouldReduceMotion={shouldReduceMotion} />
      ) : null}
    </p>
  );
};

const AIResponseCaret = ({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean | null;
}) => (
  // Inline rather than absolutely positioned, so it rides the last glyph for
  // free and never has to be told where the text ended.
  <motion.span
    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 0.15, 1] }}
    aria-hidden="true"
    className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] rounded-full bg-current align-baseline"
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : { duration: 1, ease: "linear", repeat: Number.POSITIVE_INFINITY }
    }
  />
);

const AIResponseCitationPill = ({
  citation,
  isNew,
  shouldReduceMotion,
}: {
  citation: AIResponseCitation;
  isNew: boolean;
  shouldReduceMotion: boolean;
}) => {
  const shared = {
    animate: { opacity: 1, scale: 1 },
    // No left margin: the marker is already preceded by a space in the text, so
    // adding one here doubles the gap.
    className:
      "mr-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full border border-border bg-muted px-1 align-super font-medium text-[10px] text-muted-foreground no-underline",
    initial:
      isNew && !shouldReduceMotion
        ? { opacity: 0, scale: 0.6 }
        : (false as const),
    title: citation.title,
    transition: shouldReduceMotion
      ? { duration: 0 }
      : { bounce: 0.1, duration: 0.25, type: "spring" as const },
  };

  // An internal document has nowhere to go, so it is not dressed up as a link —
  // no hover affordance, no pointer, nothing to click and be disappointed by.
  if (!citation.url) {
    return <motion.span {...shared}>{citation.index}</motion.span>;
  }

  return (
    <motion.a
      {...shared}
      className={`${shared.className} transition-colors hover:border-foreground/30 hover:text-foreground`}
      href={citation.url}
      rel="noopener noreferrer"
      target="_blank"
    >
      {citation.index}
    </motion.a>
  );
};

export default AIResponse;
