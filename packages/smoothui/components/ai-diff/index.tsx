"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const SPRING_DEFAULT = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const LINE_STAGGER = 0.02;
const WIPE_DURATION = 0.28;
const FLASH_DURATION = 0.35;
const SUCCESS_TINT = "oklch(72% 0.17 150 / 0.14)";
const DANGER_TINT = "oklch(63% 0.21 25 / 0.12)";

export type AIDiffLineKind = "added" | "removed" | "context";

export type AIDiffLine = {
  content: string;
  kind: AIDiffLineKind;
  /** Line number in the file. Omit for tabular data rather than code. */
  number?: number;
};

export type AIDiffProps = {
  className?: string;
  lines: AIDiffLine[];
  onAccept?: () => void;
  onReject?: () => void;
  /** File path or a description of what is being changed. */
  title?: string;
};

const PREFIX: Record<AIDiffLineKind, string> = {
  added: "+",
  context: " ",
  removed: "-",
};

/**
 * A proposed edit awaiting a human yes or no.
 *
 * Added lines wipe in from the left with a clip path rather than fading: a wipe
 * has a direction, and direction is what tells you the change was *written*
 * rather than always having been there. Rejecting collapses the lines to zero
 * height so the space is reclaimed — a rejected edit should stop occupying the
 * page.
 */
const AIDiff = ({
  className,
  lines,
  onAccept,
  onReject,
  title,
}: AIDiffProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [decision, setDecision] = useState<"accepted" | "rejected" | null>(
    null
  );

  const accept = () => {
    setDecision("accepted");
    onAccept?.();
  };

  const reject = () => {
    setDecision("rejected");
    onReject?.();
  };

  const added = lines.filter((line) => line.kind === "added").length;
  const removed = lines.filter((line) => line.kind === "removed").length;

  return (
    <motion.div
      // One flash on accept, then it settles. Anything more celebratory turns an
      // ordinary code review into an event.
      animate={
        decision && !shouldReduceMotion
          ? {
              backgroundColor: [
                decision === "accepted" ? SUCCESS_TINT : DANGER_TINT,
                "rgb(0 0 0 / 0)",
              ],
            }
          : undefined
      }
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-background",
        className
      )}
      layout={!shouldReduceMotion}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              backgroundColor: { duration: FLASH_DURATION, ease: EASE_OUT },
              layout: SPRING_DEFAULT,
            }
      }
    >
      <div className="flex items-center gap-2 border-border border-b px-3 py-2">
        {title ? (
          <span className="min-w-0 truncate font-mono text-foreground text-xs">
            {title}
          </span>
        ) : null}
        <span className="ml-auto flex shrink-0 items-center gap-1.5 text-xs tabular-nums">
          <span className="text-[oklch(58%_0.17_150)]">+{added}</span>
          <span className="text-destructive">-{removed}</span>
        </span>
      </div>

      <AnimatePresence initial={false}>
        {decision !== "rejected" && (
          <motion.div
            className="overflow-hidden"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { height: 0, opacity: 0 }
            }
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
          >
            <pre className="overflow-x-auto py-1 font-mono text-xs leading-relaxed">
              {lines.map((line, index) => (
                <motion.div
                  animate={
                    shouldReduceMotion
                      ? undefined
                      : { clipPath: "inset(0 0% 0 0)" }
                  }
                  className={cn(
                    "flex gap-3 px-3",
                    line.kind === "added" && "bg-[oklch(72%_0.17_150_/_0.12)]",
                    line.kind === "removed" && "bg-[oklch(63%_0.21_25_/_0.1)]"
                  )}
                  initial={
                    // Only the added lines wipe. Context lines were already
                    // there, so animating them would misrepresent the change.
                    line.kind === "added" && !shouldReduceMotion
                      ? { clipPath: "inset(0 100% 0 0)" }
                      : false
                  }
                  // biome-ignore lint/suspicious/noArrayIndexKey: diff lines are positional and may repeat verbatim
                  key={index}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          delay: index * LINE_STAGGER,
                          duration: WIPE_DURATION,
                          ease: EASE_OUT,
                        }
                  }
                >
                  {line.number !== undefined && (
                    <span className="w-6 shrink-0 select-none text-right text-muted-foreground tabular-nums">
                      {line.number}
                    </span>
                  )}
                  <span
                    className={cn(
                      "w-2 shrink-0 select-none",
                      line.kind === "added" && "text-[oklch(52%_0.17_150)]",
                      line.kind === "removed" && "text-destructive",
                      line.kind === "context" && "text-muted-foreground"
                    )}
                  >
                    {PREFIX[line.kind]}
                  </span>
                  <span className="whitespace-pre text-foreground">
                    {line.content}
                  </span>
                </motion.div>
              ))}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      {(onAccept || onReject) && !decision && (
        <div className="flex items-center justify-end gap-2 border-border border-t px-3 py-2">
          {onReject ? (
            <button
              className="cursor-pointer rounded-lg px-2.5 py-1 text-muted-foreground text-xs transition-colors hover:bg-muted hover:text-foreground"
              onClick={reject}
              type="button"
            >
              Reject
            </button>
          ) : null}
          {onAccept ? (
            <button
              className="cursor-pointer rounded-lg bg-foreground px-2.5 py-1 text-background text-xs"
              onClick={accept}
              type="button"
            >
              Accept
            </button>
          ) : null}
        </div>
      )}

      {decision ? (
        <motion.p
          animate={{ opacity: 1 }}
          className="border-border border-t px-3 py-2 text-muted-foreground text-xs capitalize"
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.2, ease: EASE_OUT }
          }
        >
          {decision}
        </motion.p>
      ) : null}
    </motion.div>
  );
};

export default AIDiff;
