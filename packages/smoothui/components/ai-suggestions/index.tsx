"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

const SPRING_DEFAULT = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};
const STAGGER_SECONDS = 0.045;

export type AISuggestion = {
  id: string;
  label: string;
};

export type AISuggestionsProps = {
  className?: string;
  /** Optional heading, e.g. "Follow-ups". */
  label?: string;
  onSelect?: (suggestion: AISuggestion) => void;
  suggestions: AISuggestion[];
};

/**
 * Distance from the middle of the row, so the stagger radiates outwards from the
 * centre instead of sweeping left to right.
 *
 * A left-to-right sweep implies reading order and priority — that the first chip
 * matters most. These are alternatives of equal weight, and radiating from the
 * centre says so.
 */
const centreOutOrder = (count: number): number[] => {
  const middle = (count - 1) / 2;
  return Array.from({ length: count }, (_, index) => Math.abs(index - middle));
};

/**
 * Prompt suggestion chips.
 *
 * Chips are the empty state of a chat and the follow-up row after an answer, so
 * they need to arrive without feeling like a notification.
 */
const AISuggestions = ({
  className,
  label,
  onSelect,
  suggestions,
}: AISuggestionsProps) => {
  const shouldReduceMotion = useReducedMotion();
  const delays = useMemo(
    () => centreOutOrder(suggestions.length),
    [suggestions.length]
  );

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {label && (
        <p className="text-muted-foreground text-xs uppercase tracking-wide">
          {label}
        </p>
      )}

      <ul className="flex list-none flex-wrap gap-2">
        <AnimatePresence initial>
          {suggestions.map((suggestion, index) => (
            <motion.li
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.94 }
              }
              initial={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.94, y: 6 }
              }
              key={suggestion.id}
              layout={!shouldReduceMotion}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      ...SPRING_DEFAULT,
                      delay: (delays[index] ?? 0) * STAGGER_SECONDS,
                    }
              }
            >
              <motion.button
                className="cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-left text-foreground text-sm transition-colors hover:border-foreground/30 hover:bg-muted"
                onClick={() => onSelect?.(suggestion)}
                transition={
                  shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT
                }
                type="button"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                {suggestion.label}
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default AISuggestions;
