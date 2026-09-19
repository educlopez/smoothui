"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FocusEvent } from "react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

const TOKEN_PATTERN = /\{\{([\w-]+)\}\}/g;
const DEFAULT_AVATAR_SIZE = 22;
const CARD_AVATAR_MULTIPLIER = 2;
const CARD_WIDTH_PX = 288;
const EDGE_PADDING_PX = 8;
const CARD_GAP_PX = 8;
const ENTER_OFFSET_PX = 4;
const CLOSE_DELAY_MS = 140;
const STAR_COUNT = 5;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SPRING = { bounce: 0.1, duration: 0.25, type: "spring" } as const;
/** Leaving is a decision already made — get out of the way faster. */
const EXIT_TRANSITION = { duration: 0.15, ease: EASE_OUT } as const;
const INSTANT = { duration: 0 } as const;

type TextSegment =
  | { type: "text"; value: string }
  | { type: "token"; id: string };

type CardPosition = {
  left: number;
  originX: number;
  spaceAbove: number;
  spaceBelow: number;
  triggerBottom: number;
  triggerTop: number;
  width: number;
};

const parseSegments = (text: string): TextSegment[] => {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(TOKEN_PATTERN)) {
    const [full, id] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    segments.push({ id, type: "token" });
    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: "text", value: text.slice(lastIndex) });
  }

  return segments;
};

export type Testimonial = {
  avatar: string;
  id: string;
  name: string;
  quote: string;
  rating?: number;
  role: string;
};

export type InlineTestimonialsProps = {
  avatarSize?: number;
  className?: string;
  onOpenChange?: (id: string | null) => void;
  openId?: string | null;
  testimonials: Testimonial[];
  text: string;
};

const useHoverDevice = () => {
  const [isHoverDevice, setIsHoverDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverDevice(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isHoverDevice;
};

const QuoteCard = ({
  avatarSize,
  cardId,
  testimonial,
}: {
  avatarSize: number;
  cardId: string;
  testimonial: Testimonial;
}) => (
  <div
    className={cn(
      "rounded-xl border border-foreground/10 bg-background p-4 text-left",
      // Ambient + direct light rather than one flat drop, so the card reads as
      // lifted off the paragraph instead of stamped onto it.
      "shadow-[0_1px_2px_rgb(0_0_0/0.05),0_14px_32px_-14px_rgb(0_0_0/0.28)]",
      "dark:border-foreground/15 dark:bg-smooth-100 dark:shadow-[0_1px_2px_rgb(0_0_0/0.4),0_14px_32px_-14px_rgb(0_0_0/0.7)]"
    )}
    id={cardId}
  >
    <div className="flex items-center gap-3">
      <img
        alt=""
        className="shrink-0 rounded-full object-cover"
        height={avatarSize * CARD_AVATAR_MULTIPLIER}
        src={testimonial.avatar}
        width={avatarSize * CARD_AVATAR_MULTIPLIER}
      />
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground text-sm">
          {testimonial.name}
        </p>
        <p className="truncate text-muted-foreground text-xs">
          {testimonial.role}
        </p>
      </div>
    </div>
    <blockquote className="mt-3 text-foreground/80 text-sm leading-relaxed">
      {testimonial.quote}
    </blockquote>
    {testimonial.rating ? (
      <div
        aria-label={`Rated ${testimonial.rating} out of 5`}
        className="mt-3 flex items-center gap-0.5"
      >
        {Array.from({ length: STAR_COUNT }, (_, position) => {
          const filled = position < Math.round(testimonial.rating ?? 0);
          return (
            <Star
              aria-hidden="true"
              className={cn(
                "size-3.5",
                // Neutral: the one accent in this component is the open
                // trigger's underline, and a row of pink stars would outrank it.
                filled
                  ? "fill-foreground/75 text-foreground/75"
                  : "fill-transparent text-foreground/20"
              )}
              key={`${cardId}-star-${position}`}
            />
          );
        })}
      </div>
    ) : null}
  </div>
);

const InlineTestimonials = ({
  text,
  testimonials,
  avatarSize = DEFAULT_AVATAR_SIZE,
  openId,
  onOpenChange,
  className,
}: InlineTestimonialsProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const isHoverDevice = useHoverDevice();
  const [internalOpenId, setInternalOpenId] = useState<string | null>(null);
  const [position, setPosition] = useState<CardPosition | null>(null);
  const [cardHeight, setCardHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const triggerRefs = useRef(new Map<string, HTMLButtonElement>());
  const closeTimerRef = useRef<number | null>(null);

  const isControlled = openId !== undefined;
  const activeOpenId = isControlled ? openId : internalOpenId;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  const commitOpenId = useCallback(
    (id: string | null) => {
      if (!isControlled) {
        setInternalOpenId(id);
      }
      onOpenChange?.(id);
    },
    [isControlled, onOpenChange]
  );

  const open = useCallback(
    (id: string) => {
      clearCloseTimer();
      commitOpenId(id);
    },
    [clearCloseTimer, commitOpenId]
  );

  const close = useCallback(() => {
    clearCloseTimer();
    commitOpenId(null);
  }, [clearCloseTimer, commitOpenId]);

  // A delayed close keeps the card alive while the pointer crosses the gap
  // between the trigger and the card — the usual source of popover flicker.
  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      commitOpenId(null);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer, commitOpenId]);

  const measure = useCallback((id: string) => {
    const container = containerRef.current;
    const trigger = triggerRefs.current.get(id);
    if (!(container && trigger)) {
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const width = Math.min(
      CARD_WIDTH_PX,
      Math.max(containerRect.width - EDGE_PADDING_PX * 2, 0)
    );
    const center =
      triggerRect.left - containerRect.left + triggerRect.width / 2;
    const maxLeft = Math.max(
      containerRect.width - width - EDGE_PADDING_PX,
      EDGE_PADDING_PX
    );
    const left = Math.min(
      Math.max(center - width / 2, EDGE_PADDING_PX),
      maxLeft
    );
    setPosition({
      left,
      originX: center - left,
      // Vertical room is measured against the viewport, not the paragraph:
      // the paragraph is only a few lines tall, so the card would always
      // "not fit" and never get the chance to sit below its trigger.
      spaceAbove: triggerRect.top,
      spaceBelow: window.innerHeight - triggerRect.bottom,
      triggerBottom: triggerRect.bottom - containerRect.top,
      triggerTop: triggerRect.top - containerRect.top,
      width,
    });
  }, []);

  // Clamping happens against live measurements, so the card can never
  // overflow the container sideways — and it follows the trigger on
  // resize and scroll.
  useEffect(() => {
    if (!activeOpenId) {
      return;
    }
    measure(activeOpenId);
    const remeasure = () => measure(activeOpenId);
    window.addEventListener("resize", remeasure);
    window.addEventListener("scroll", remeasure, true);
    return () => {
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("scroll", remeasure, true);
    };
  }, [activeOpenId, measure]);

  // The rendered popover's own height decides whether it still fits below.
  // This measures the gap-plus-card wrapper, not the card alone.
  useEffect(() => {
    const node = cardRef.current;
    if (node) {
      setCardHeight(node.offsetHeight);
    }
  }, [activeOpenId, position]);

  useEffect(() => {
    if (!activeOpenId) {
      return;
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      const trigger = triggerRefs.current.get(activeOpenId);
      close();
      trigger?.focus();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeOpenId, close]);

  const handleContainerBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && containerRef.current?.contains(next)) {
      return;
    }
    close();
  };

  const handleTriggerFocus = (
    event: FocusEvent<HTMLButtonElement>,
    id: string
  ) => {
    // Only keyboard focus opens the card; a mouse click is handled by onClick,
    // otherwise focus-then-click would open and immediately close it again.
    if (event.currentTarget.matches(":focus-visible")) {
      open(id);
    }
  };

  const testimonialsById = new Map(
    testimonials.map((entry) => [entry.id, entry])
  );
  const segments = parseSegments(text);
  const activeTestimonial = activeOpenId
    ? testimonialsById.get(activeOpenId)
    : undefined;

  // Flip above the trigger when the card would spill past the viewport.
  const requiredSpace = cardHeight + EDGE_PADDING_PX;
  const flipUp = Boolean(
    position &&
      cardHeight > 0 &&
      position.spaceBelow < requiredSpace &&
      position.spaceAbove >= requiredSpace
  );
  // Enter and exit travel in the same direction, so opening and closing read
  // as one movement rather than two unrelated ones.
  const enterOffset = flipUp ? ENTER_OFFSET_PX : -ENTER_OFFSET_PX;

  return (
    <div
      className={cn("relative text-foreground/90 leading-relaxed", className)}
      onBlur={handleContainerBlur}
      ref={containerRef}
    >
      <p>
        {segments.map((segment, index) => {
          if (segment.type === "text") {
            return (
              <Fragment key={`text-${index}-${segment.value.slice(0, 8)}`}>
                {segment.value}
              </Fragment>
            );
          }

          const testimonial = testimonialsById.get(segment.id);
          if (!testimonial) {
            return null;
          }

          const isOpen = activeOpenId === testimonial.id;
          const cardId = `inline-testimonial-${testimonial.id}`;

          return (
            <button
              aria-controls={cardId}
              aria-expanded={isOpen}
              // An enriched word, not a chip: the name keeps the prose's size
              // and colour, and only picks up a face and a hairline rule under
              // it. Nothing here breaks the line's rhythm.
              className={cn(
                "group mx-[0.12em] inline-flex cursor-pointer items-center gap-[0.32em] rounded-[0.3em] align-middle font-medium text-foreground outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              )}
              key={segment.id}
              onClick={() => (isOpen ? close() : open(testimonial.id))}
              onFocus={(event) => handleTriggerFocus(event, testimonial.id)}
              onMouseEnter={() => {
                if (isHoverDevice) {
                  open(testimonial.id);
                }
              }}
              onMouseLeave={() => {
                if (isHoverDevice) {
                  scheduleClose();
                }
              }}
              ref={(node) => {
                if (node) {
                  triggerRefs.current.set(testimonial.id, node);
                } else {
                  triggerRefs.current.delete(testimonial.id);
                }
              }}
              type="button"
            >
              <img
                alt=""
                className={cn(
                  "shrink-0 rounded-full object-cover ring-1 transition-[box-shadow] duration-150 ease-out",
                  isOpen ? "ring-brand/60" : "ring-foreground/15"
                )}
                height={avatarSize}
                src={testimonial.avatar}
                width={avatarSize}
              />
              <span
                className={cn(
                  // leading-none keeps the rule tight under the name: without
                  // it the span inherits the paragraph's line-height and the
                  // underline drops to the bottom of the whole line box.
                  "border-b-[1.5px] pb-[0.08em] leading-none transition-colors duration-150 ease-out",
                  isOpen
                    ? "border-brand"
                    : "border-foreground/25 group-hover:border-foreground/50"
                )}
              >
                {testimonial.name}
              </span>
            </button>
          );
        })}
      </p>
      <AnimatePresence>
        {activeTestimonial && position ? (
          // AnimatePresence drives exits through motion children of its own, so
          // the positioned wrapper IS the animated element. Its padding is the
          // gap AND a hover bridge: it keeps the pointer inside the card's
          // hover region on its way over from the trigger.
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={cn("absolute z-20", flipUp ? "pb-2" : "pt-2")}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: INSTANT }
                : {
                    opacity: 0,
                    scale: 0.97,
                    transition: EXIT_TRANSITION,
                    y: enterOffset,
                  }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.97, y: enterOffset }
            }
            key="inline-testimonial-popover"
            onMouseEnter={clearCloseTimer}
            onMouseLeave={scheduleClose}
            ref={cardRef}
            style={{
              left: position.left,
              top: flipUp
                ? position.triggerTop - cardHeight
                : position.triggerBottom,
              // Scale from the trigger's centre, at the card's own edge rather
              // than the bridge padding's.
              transformOrigin: `${position.originX}px ${
                flipUp ? `${cardHeight - CARD_GAP_PX}px` : `${CARD_GAP_PX}px`
              }`,
              width: position.width,
            }}
            transition={shouldReduceMotion ? INSTANT : SPRING}
          >
            <QuoteCard
              avatarSize={avatarSize}
              cardId={`inline-testimonial-${activeTestimonial.id}`}
              testimonial={activeTestimonial}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default InlineTestimonials;
