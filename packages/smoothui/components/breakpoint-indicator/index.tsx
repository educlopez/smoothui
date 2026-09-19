"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "smoothui:breakpoint-indicator:visible";
const DEFAULT_HOTKEY = "b";
const DEFAULT_POSITION: BreakpointIndicatorPosition = "bottom-left";
const BASE_BREAKPOINT_NAME = "base";
const RULER_MIN_PERCENT = 0;
const RULER_MAX_PERCENT = 100;

const DEFAULT_BREAKPOINTS: Breakpoint[] = [
  { min: 640, name: "sm" },
  { min: 768, name: "md" },
  { min: 1024, name: "lg" },
  { min: 1280, name: "xl" },
  { min: 1536, name: "2xl" },
];

export interface Breakpoint {
  min: number;
  name: string;
}

export type BreakpointIndicatorPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export interface BreakpointIndicatorProps {
  breakpoints?: Breakpoint[];
  className?: string;
  enabled?: boolean;
  fixed?: boolean;
  hotkey?: string;
  position?: BreakpointIndicatorPosition;
  showRuler?: boolean;
  showSize?: boolean;
}

const POSITION_CLASSES: Record<BreakpointIndicatorPosition, string> = {
  "bottom-left": "bottom-3 left-3",
  "bottom-right": "bottom-3 right-3",
  "top-left": "top-3 left-3",
  "top-right": "top-3 right-3",
};

const readStoredVisibility = (): boolean => {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
};

const getActiveBreakpoint = (
  breakpoints: Breakpoint[],
  width: number
): { active: Breakpoint; next: Breakpoint | null } => {
  const sorted = [...breakpoints].sort((a, b) => a.min - b.min);
  let active: Breakpoint = { min: 0, name: BASE_BREAKPOINT_NAME };
  let next: Breakpoint | null = sorted[0] ?? null;

  for (let index = 0; index < sorted.length; index += 1) {
    const candidate = sorted[index];
    if (width >= candidate.min) {
      active = candidate;
      next = sorted[index + 1] ?? null;
    }
  }

  return { active, next };
};

const clampPercent = (value: number): number =>
  Math.min(RULER_MAX_PERCENT, Math.max(RULER_MIN_PERCENT, value));

export default function BreakpointIndicator({
  breakpoints = DEFAULT_BREAKPOINTS,
  className,
  enabled = process.env.NODE_ENV !== "production",
  fixed = true,
  hotkey = DEFAULT_HOTKEY,
  position = DEFAULT_POSITION,
  showRuler = false,
  showSize = true,
}: BreakpointIndicatorProps) {
  const shouldReduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [visible, setVisible] = useState<boolean>(readStoredVisibility);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return;
    }

    let frame = 0;
    const measure = () => {
      frame = 0;
      setWidth(document.documentElement.clientWidth);
      setHeight(document.documentElement.clientHeight);
    };

    const observer = new ResizeObserver(() => {
      if (frame) {
        return;
      }
      frame = window.requestAnimationFrame(measure);
    });

    observer.observe(document.documentElement);
    measure();

    return () => {
      observer.disconnect();
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const normalizedHotkey = hotkey.toLowerCase();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === normalizedHotkey
      ) {
        event.preventDefault();
        setVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, hotkey]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, String(visible));
    } catch {
      // localStorage unavailable (private mode, blocked storage, etc.)
    }
  }, [enabled, visible]);

  if (!(enabled && visible)) {
    return null;
  }

  const { active, next } = getActiveBreakpoint(breakpoints, width);
  const rulerPercent = next
    ? clampPercent(((width - active.min) / (next.min - active.min)) * 100)
    : RULER_MAX_PERCENT;
  const remainingPx = next ? Math.max(0, next.min - width) : 0;

  return (
    <div
      aria-label={`Current breakpoint ${active.name}, viewport ${width} by ${height} pixels`}
      aria-live="polite"
      className={cn(
        "z-50 flex items-center gap-2 rounded-full border border-foreground/10 bg-background/95 px-3 py-1.5 font-mono text-foreground text-xs shadow-lg backdrop-blur",
        fixed ? "fixed" : "absolute",
        POSITION_CLASSES[position],
        className
      )}
      role="status"
    >
      <div className="relative h-4 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            animate={
              shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }
            }
            className="inline-block font-semibold uppercase tracking-wide"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, y: -8 }
            }
            initial={
              shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
            }
            key={active.name}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { bounce: 0.1, duration: 0.25, type: "spring" }
            }
          >
            {active.name}
          </motion.span>
        </AnimatePresence>
      </div>

      {showSize ? (
        <span className="text-foreground/60">
          {width}×{height}
        </span>
      ) : null}

      {showRuler ? (
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <div className="h-1 w-16 overflow-hidden rounded-full bg-foreground/10">
            <div
              className="h-full bg-foreground/60"
              style={{ width: `${rulerPercent}%` }}
            />
          </div>
          {next ? (
            <span className="text-foreground/40">{remainingPx}px</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
