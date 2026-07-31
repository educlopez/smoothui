"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useState } from "react";

const SPRING_DEFAULT = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const BADGE_VIEWBOX = 24;
const BADGE_CENTER = BADGE_VIEWBOX / 2;
const RING_RADIUS = 8;
const CHECK_PATH = "M 8.5 12.2 L 11 14.8 L 15.8 9.6";
const CROSS_PATHS = ["M 9 9 L 15 15", "M 15 9 L 9 15"] as const;
const SPIN_SECONDS = 0.9;
const PENDING_PULSE_SECONDS = 1.6;

export type AIToolCallStatus = "pending" | "running" | "success" | "error";

export type AIToolCallProps = {
  /** Arguments the tool was called with. Rendered as-is. */
  args?: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  /** Tool name, e.g. `search_web`. */
  name: string;
  /** What the tool returned. */
  result?: ReactNode;
  status?: AIToolCallStatus;
  /** Short right-aligned note, e.g. "3 files" or "1.2s". */
  summary?: string;
};

const STATUS_LABEL: Record<AIToolCallStatus, string> = {
  error: "Failed",
  pending: "Queued",
  running: "Running",
  success: "Done",
};

/**
 * The status badge is **one ring that changes behaviour**, not four icons that
 * swap places.
 *
 * `pending` breathes, `running` spins as a gap in the same ring, `success` keeps
 * the ring and draws a check inside it, `error` keeps the ring and draws a
 * cross. Because the ring never unmounts, the eye tracks a single object through
 * the whole lifecycle instead of watching icons pop in and out.
 */
const AIToolCallBadge = ({
  status,
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean;
  status: AIToolCallStatus;
}) => {
  const isRunning = status === "running";
  const isPending = status === "pending";

  const ringColor = (() => {
    if (status === "success") {
      return "oklch(72% 0.17 150)";
    }
    if (status === "error") {
      return "oklch(63% 0.21 25)";
    }
    return "currentColor";
  })();

  return (
    <span className="relative flex size-5 shrink-0 items-center justify-center text-muted-foreground">
      <svg
        aria-hidden="true"
        className="size-5 overflow-visible"
        viewBox={`0 0 ${BADGE_VIEWBOX} ${BADGE_VIEWBOX}`}
      >
        <motion.g
          animate={
            shouldReduceMotion || !isRunning ? undefined : { rotate: 360 }
          }
          style={{ transformBox: "view-box", transformOrigin: "center" }}
          transition={{
            duration: SPIN_SECONDS,
            ease: "linear",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <motion.circle
            animate={{
              stroke: ringColor,
              // Running opens a gap in the ring; everything else closes it.
              strokeDasharray: isRunning ? "0.68 0.32" : "1 0",
              strokeOpacity:
                isPending && !shouldReduceMotion ? [0.35, 1, 0.35] : 1,
            }}
            cx={BADGE_CENTER}
            cy={BADGE_CENTER}
            fill="none"
            pathLength={1}
            r={RING_RADIUS}
            strokeLinecap="round"
            strokeWidth={2}
            transition={{
              stroke: shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.25, ease: EASE_OUT },
              strokeDasharray: shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.25, ease: EASE_OUT },
              strokeOpacity: shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: PENDING_PULSE_SECONDS,
                    repeat: Number.POSITIVE_INFINITY,
                  },
            }}
          />
        </motion.g>

        <AnimatePresence initial={false}>
          {status === "success" && (
            <motion.path
              animate={{ opacity: 1, pathLength: 1 }}
              d={CHECK_PATH}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              fill="none"
              initial={
                shouldReduceMotion
                  ? { opacity: 1, pathLength: 1 }
                  : { opacity: 1, pathLength: 0 }
              }
              key="check"
              stroke={ringColor}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.22, ease: EASE_OUT }
              }
            />
          )}
          {status === "error" &&
            CROSS_PATHS.map((path, index) => (
              <motion.path
                animate={{ opacity: 1, pathLength: 1 }}
                d={path}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                fill="none"
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, pathLength: 1 }
                    : { opacity: 1, pathLength: 0 }
                }
                key={path}
                stroke={ringColor}
                strokeLinecap="round"
                strokeWidth={2.2}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { delay: index * 0.06, duration: 0.16, ease: EASE_OUT }
                }
              />
            ))}
        </AnimatePresence>
      </svg>
    </span>
  );
};

/**
 * A single tool invocation, collapsed by default.
 *
 * Arguments and results are the kind of thing people want available but not
 * in their face, so the row stays one line until asked.
 */
const AIToolCall = ({
  args,
  className,
  defaultOpen = false,
  name,
  result,
  status = "pending",
  summary,
}: AIToolCallProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const hasDetail = Boolean(args || result);

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-background",
        className
      )}
    >
      <button
        aria-expanded={hasDetail ? isOpen : undefined}
        className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left"
        disabled={!hasDetail}
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <AIToolCallBadge
          shouldReduceMotion={Boolean(shouldReduceMotion)}
          status={status}
        />

        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium font-mono text-foreground text-xs">
            {name}
          </span>
        </span>

        {summary ? (
          <span className="shrink-0 text-muted-foreground text-xs">
            {summary}
          </span>
        ) : null}
        <span className="sr-only">{STATUS_LABEL[status]}</span>

        {hasDetail && (
          <motion.span
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="flex size-4 shrink-0 items-center justify-center text-muted-foreground"
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
          >
            <ChevronRight aria-hidden="true" size={14} />
          </motion.span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && hasDetail ? (
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
            <div className="space-y-2 border-border border-t px-3 py-2.5 text-xs">
              {args ? (
                <div>
                  <p className="mb-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                    Arguments
                  </p>
                  <div className="overflow-x-auto font-mono text-foreground">
                    {args}
                  </div>
                </div>
              ) : null}
              {result ? (
                <div>
                  <p className="mb-1 text-[10px] text-muted-foreground uppercase tracking-wide">
                    Result
                  </p>
                  <div className="overflow-x-auto text-foreground">
                    {result}
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default AIToolCall;
