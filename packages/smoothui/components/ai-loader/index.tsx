"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useAnimationFrame, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

/**
 * One cycle length for every variant.
 *
 * Two loaders on the same screen running at different tempos read as two
 * unrelated things loading. Sharing the cycle makes them feel like one system
 * working, which is the whole point of a loader family.
 */
export const AI_LOADER_CYCLE_SECONDS = 1.2;

const DOT_COUNT = 3;
const GRID_SIZE = 3;
const GRID_CELLS = GRID_SIZE * GRID_SIZE;
/** Diagonal wave order, so the grid fills like a sweep rather than at random. */
const GRID_DELAYS = [0, 1, 2, 1, 2, 3, 2, 3, 4];
const EASE_IN_OUT = [0.645, 0.045, 0.355, 1] as const;
const MS_PER_SECOND = 1000;
const ELAPSED_DECIMALS = 1;

export type AILoaderVariant = "dots" | "bar" | "grid";

export type AILoaderProps = {
  className?: string;
  /** Optional text before the indicator, e.g. "Thinking". */
  label?: string;
  /** Appends a live elapsed counter. Long waits need a sign of progress. */
  showElapsed?: boolean;
  variant?: AILoaderVariant;
};

const Dots = ({ reduced }: { reduced: boolean }) => (
  <span className="flex items-center gap-1">
    {Array.from({ length: DOT_COUNT }, (_, index) => (
      <motion.span
        animate={reduced ? { opacity: 0.5 } : { opacity: [0.25, 1, 0.25] }}
        className="size-1.5 rounded-full bg-current"
        // biome-ignore lint/suspicious/noArrayIndexKey: dots are positional
        key={index}
        transition={
          reduced
            ? { duration: 0 }
            : {
                delay: (index * AI_LOADER_CYCLE_SECONDS) / (DOT_COUNT * 2),
                duration: AI_LOADER_CYCLE_SECONDS,
                ease: EASE_IN_OUT,
                repeat: Number.POSITIVE_INFINITY,
              }
        }
      />
    ))}
  </span>
);

const Bar = ({ reduced }: { reduced: boolean }) => (
  <span className="relative block h-1 w-24 overflow-hidden rounded-full bg-current/15">
    {/* A sweep, not a percentage. Faking determinate progress for an unknown
        wait is the one thing a loader must never do. */}
    <motion.span
      animate={reduced ? { x: "0%" } : { x: ["-100%", "200%"] }}
      className="absolute inset-y-0 w-1/3 rounded-full bg-current"
      transition={
        reduced
          ? { duration: 0 }
          : {
              duration: AI_LOADER_CYCLE_SECONDS * 1.4,
              ease: EASE_IN_OUT,
              repeat: Number.POSITIVE_INFINITY,
            }
      }
    />
  </span>
);

const Grid = ({ reduced }: { reduced: boolean }) => (
  <span className="grid grid-cols-3 gap-0.5">
    {Array.from({ length: GRID_CELLS }, (_, index) => (
      <motion.span
        animate={reduced ? { opacity: 0.45 } : { opacity: [0.2, 1, 0.2] }}
        className="size-1.5 rounded-[2px] bg-current"
        // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
        key={index}
        transition={
          reduced
            ? { duration: 0 }
            : {
                delay:
                  ((GRID_DELAYS[index] ?? 0) * AI_LOADER_CYCLE_SECONDS) / 8,
                duration: AI_LOADER_CYCLE_SECONDS,
                ease: EASE_IN_OUT,
                repeat: Number.POSITIVE_INFINITY,
              }
        }
      />
    ))}
  </span>
);

const Elapsed = () => {
  const startRef = useRef<number | null>(null);
  const [seconds, setSeconds] = useState(0);

  useAnimationFrame((time) => {
    const start = startRef.current ?? time;
    startRef.current = start;
    const next = (time - start) / MS_PER_SECOND;
    // Only re-render on a tenth changing — a 60fps counter is unreadable and
    // re-renders the whole label for nothing.
    setSeconds((current) =>
      next.toFixed(ELAPSED_DECIMALS) === current.toFixed(ELAPSED_DECIMALS)
        ? current
        : next
    );
  });

  return (
    <span className="tabular-nums opacity-60">
      {seconds.toFixed(ELAPSED_DECIMALS)}s
    </span>
  );
};

/**
 * The waiting indicator family.
 *
 * All three variants share one cycle length, so a page can mix them without the
 * result looking out of sync. None of them fake determinate progress.
 */
const AILoader = ({
  className,
  label,
  showElapsed = false,
  variant = "dots",
}: AILoaderProps) => {
  const reduced = Boolean(useReducedMotion());

  return (
    <span
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 text-muted-foreground text-sm",
        className
      )}
      role="status"
    >
      {label ? <span>{label}</span> : null}
      {variant === "dots" && <Dots reduced={reduced} />}
      {variant === "bar" && <Bar reduced={reduced} />}
      {variant === "grid" && <Grid reduced={reduced} />}
      {showElapsed ? <Elapsed /> : null}
      <span className="sr-only">{label ?? "Loading"}</span>
    </span>
  );
};

export default AILoader;
