"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Check, Copy } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useState } from "react";

const SPRING_DEFAULT = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const TRAVEL_PX = 24;
const COPIED_RESET_MS = 1600;

export type AIArtifactPane = "preview" | "code";

export type AIArtifactProps = {
  className?: string;
  /** The raw form — source, JSON, markup. */
  code?: ReactNode;
  /** Plain text handed to the clipboard. Omit to hide the copy action. */
  copyText?: string;
  /** Which pane to start on. */
  defaultPane?: AIArtifactPane;
  /** The rendered form. */
  preview?: ReactNode;
  /** Name the artifact so it can be referred to in conversation. */
  title: string;
};

const PANES: AIArtifactPane[] = ["preview", "code"];

/**
 * A frame around something the model produced.
 *
 * The two panes travel along a single horizontal axis — preview sits to the left
 * of code, always — so the swap has a direction and, after one go, a memory. A
 * cross-fade between them would leave the user with no sense of where the other
 * pane went, and no expectation of where it will come back from.
 */
const AIArtifact = ({
  className,
  code,
  copyText,
  defaultPane = "preview",
  preview,
  title,
}: AIArtifactProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [pane, setPane] = useState<AIArtifactPane>(defaultPane);
  const [hasCopied, setHasCopied] = useState(false);
  const indicatorId = useId();

  const available = PANES.filter((candidate) =>
    candidate === "preview" ? Boolean(preview) : Boolean(code)
  );

  useEffect(() => {
    if (!hasCopied) {
      return;
    }
    const timeout = setTimeout(() => setHasCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timeout);
  }, [hasCopied]);

  const copy = async () => {
    if (!copyText) {
      return;
    }
    try {
      await navigator.clipboard.writeText(copyText);
      setHasCopied(true);
    } catch {
      // A blocked clipboard is not worth an error state.
    }
  };

  const direction = pane === "code" ? 1 : -1;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-background",
        className
      )}
    >
      <div className="flex items-center gap-2 border-border border-b px-2 py-1.5">
        <span className="min-w-0 truncate px-1 font-medium text-foreground text-xs">
          {title}
        </span>

        {available.length > 1 && (
          <div className="ml-auto flex items-center gap-0.5 rounded-lg bg-muted p-0.5">
            {available.map((candidate) => (
              <button
                aria-selected={pane === candidate}
                className={cn(
                  "relative cursor-pointer rounded-md px-2 py-1 text-xs capitalize transition-colors",
                  pane === candidate
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                key={candidate}
                onClick={() => setPane(candidate)}
                role="tab"
                type="button"
              >
                {pane === candidate && (
                  // A single shared element slides between the tabs. Two
                  // separately styled tabs would just swap colour, which reads
                  // as two states rather than one selection moving.
                  <motion.span
                    className="absolute inset-0 rounded-md bg-background shadow-sm"
                    layoutId={`${indicatorId}-indicator`}
                    transition={
                      shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT
                    }
                  />
                )}
                <span className="relative">{candidate}</span>
              </button>
            ))}
          </div>
        )}

        {copyText ? (
          <button
            aria-label={hasCopied ? "Copied" : "Copy"}
            className={cn(
              "cursor-pointer rounded-md p-1.5 transition-colors",
              available.length > 1 ? "" : "ml-auto",
              hasCopied
                ? "text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            onClick={copy}
            type="button"
          >
            {hasCopied ? (
              <Check aria-hidden="true" size={13} />
            ) : (
              <Copy aria-hidden="true" size={13} />
            )}
          </button>
        ) : null}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            custom={direction}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, x: -direction * TRAVEL_PX }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: direction * TRAVEL_PX }
            }
            key={pane}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.2, ease: EASE_OUT }
            }
          >
            {pane === "preview" ? (
              <div className="p-3">{preview}</div>
            ) : (
              <pre className="overflow-x-auto p-3 font-mono text-foreground text-xs leading-relaxed">
                {code}
              </pre>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIArtifact;
