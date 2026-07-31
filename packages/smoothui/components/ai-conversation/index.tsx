"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ArrowDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const SPRING_DEFAULT = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};
/**
 * How close to the bottom still counts as "at the bottom".
 *
 * Zero would break on fractional scroll heights, and anything large would keep
 * yanking the view down while someone is reading a few lines up.
 */
const BOTTOM_THRESHOLD_PX = 48;

export type AIConversationProps = {
  children: ReactNode;
  className?: string;
  /**
   * Changes whenever content grows — message count, or streamed text length.
   * Used to decide when to follow the bottom.
   */
  contentKey?: string | number;
};

/**
 * Scroll container for a thread.
 *
 * It follows the bottom **only while the reader is already there**. Scrolling up
 * during a stream is an explicit act — the user wants to read something — and
 * dragging them back down is the single most common way chat UIs become
 * unusable. When it stops following, a pill appears to offer the trip back.
 */
const AIConversation = ({
  children,
  className,
  contentKey,
}: AIConversationProps) => {
  const shouldReduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [isPinned, setIsPinned] = useState(true);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    const distance =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    setIsPinned(distance <= BOTTOM_THRESHOLD_PX);
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior) => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    // Element.scrollTo is missing in jsdom and in a few older engines, and it is
    // not worth throwing over — assigning scrollTop lands in the same place,
    // just without the smoothing.
    if (typeof viewport.scrollTo === "function") {
      viewport.scrollTo({ behavior, top: viewport.scrollHeight });
    } else {
      viewport.scrollTop = viewport.scrollHeight;
    }
    setIsPinned(true);
  }, []);

  // Layout effect, so the jump happens in the same frame the content grew and
  // the reader never sees a flash of the pre-scroll position.
  useLayoutEffect(() => {
    if (isPinned) {
      scrollToBottom(shouldReduceMotion ? "auto" : "smooth");
    }
  }, [contentKey, isPinned, scrollToBottom, shouldReduceMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }
    // A resize observer catches content that grows without contentKey changing —
    // an image finishing loading, a details element opening.
    const observer = new ResizeObserver(measure);
    for (const child of Array.from(viewport.children)) {
      observer.observe(child);
    }
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div className={cn("relative min-h-0 w-full", className)}>
      <div
        className="h-full overflow-y-auto overscroll-contain"
        onScroll={measure}
        ref={viewportRef}
      >
        {children}
      </div>

      <AnimatePresence initial={false}>
        {!isPinned && (
          <motion.button
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label="Jump to latest"
            className="absolute inset-x-0 bottom-3 mx-auto flex w-fit cursor-pointer items-center gap-1.5 rounded-full border border-border bg-background/90 py-1.5 pr-3 pl-2.5 text-foreground text-xs shadow-sm backdrop-blur"
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.96, y: 8 }
            }
            onClick={() =>
              scrollToBottom(shouldReduceMotion ? "auto" : "smooth")
            }
            transition={shouldReduceMotion ? { duration: 0 } : SPRING_DEFAULT}
            type="button"
          >
            <ArrowDown aria-hidden="true" size={13} />
            Jump to latest
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIConversation;
