"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useRef, useState } from "react";

const SPRING_DEFAULT = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/**
 * A beat before auto-collapsing. Snapping shut the instant the trace finishes
 * makes it feel like the content was yanked away mid-read.
 */
const AUTO_COLLAPSE_DELAY_MS = 600;
const MS_PER_SECOND = 1000;
const SHIMMER_SECONDS = 1.8;

export type AIReasoningProps = {
  children: ReactNode;
  className?: string;
  /**
   * Collapse itself once `isStreaming` goes false. The trace is scaffolding —
   * interesting while it happens, clutter once the answer has landed.
   */
  collapseWhenDone?: boolean;
  /** Start expanded. */
  defaultOpen?: boolean;
  /** Seconds the model spent. Omit to have the component time it itself. */
  duration?: number;
  isStreaming?: boolean;
};

/**
 * Collapsible reasoning trace.
 *
 * The summary line shimmers only while the model is actually working, so the
 * shimmer means something rather than being decoration. When the trace ends it
 * settles, reports how long it took, and gets out of the way.
 */
const AIReasoning = ({
  children,
  className,
  collapseWhenDone = true,
  defaultOpen,
  duration,
  isStreaming = false,
}: AIReasoningProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(defaultOpen ?? isStreaming);
  // Once someone opens or closes it by hand, stop deciding for them.
  const [isUserControlled, setIsUserControlled] = useState(false);

  const startedAtRef = useRef<number | null>(null);
  const [measuredSeconds, setMeasuredSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (isStreaming) {
      startedAtRef.current = Date.now();
      setMeasuredSeconds(null);
      if (!isUserControlled) {
        setIsOpen(true);
      }
      return;
    }
    if (startedAtRef.current !== null) {
      setMeasuredSeconds((Date.now() - startedAtRef.current) / MS_PER_SECOND);
      startedAtRef.current = null;
    }
  }, [isStreaming, isUserControlled]);

  useEffect(() => {
    if (isStreaming || !collapseWhenDone || isUserControlled) {
      return;
    }
    const timeout = setTimeout(() => setIsOpen(false), AUTO_COLLAPSE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [collapseWhenDone, isStreaming, isUserControlled]);

  const seconds = duration ?? measuredSeconds;
  const summary = (() => {
    if (isStreaming) {
      return "Thinking";
    }
    if (seconds !== null) {
      return `Thought for ${seconds.toFixed(1)}s`;
    }
    return "Reasoning";
  })();

  return (
    <div className={cn("w-full", className)}>
      <button
        aria-expanded={isOpen}
        className="group flex w-full cursor-pointer items-center gap-1.5 rounded-lg py-1 text-left text-muted-foreground text-sm transition-colors hover:text-foreground"
        onClick={() => {
          setIsUserControlled(true);
          setIsOpen((current) => !current);
        }}
        type="button"
      >
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          className="flex size-4 items-center justify-center"
          transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
        >
          <ChevronRight aria-hidden="true" size={14} />
        </motion.span>

        {/* The shimmer is the "still working" signal, so it exists only while
            streaming. A permanently shimmering label is just decoration. */}
        {isStreaming && !shouldReduceMotion ? (
          <span
            className="bg-[length:200%_100%] bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, currentColor 0%, currentColor 35%, color-mix(in oklab, currentColor 25%, transparent) 50%, currentColor 65%, currentColor 100%)",
              animation: `ai-reasoning-shimmer ${SHIMMER_SECONDS}s linear infinite`,
            }}
          >
            {summary}
          </span>
        ) : (
          <span>{summary}</span>
        )}
      </button>

      <style>{`
        @keyframes ai-reasoning-shimmer {
          from { background-position: 200% 0; }
          to { background-position: -200% 0; }
        }
      `}</style>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { height: 0, opacity: 0 }
            }
            initial={
              shouldReduceMotion
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    height: SPRING_DEFAULT,
                    opacity: { duration: 0.18, ease: EASE_OUT },
                  }
            }
          >
            {/* The rule doubles as a margin: the trace reads as an aside, not as
                part of the answer. */}
            <div className="mt-1 ml-[7px] border-border border-l pl-4 text-muted-foreground text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIReasoning;
