"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import gsap from "gsap";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useClickOutside } from "./use-click-outside";

const MEASURE_DELAY_SHORT = 100;
const MEASURE_DELAY_LONG = 500;
const DEFAULT_TRIGGER_SIZE = 44;
const DEFAULT_CONTENT_WIDTH = 240;
const DEFAULT_SIDE_OFFSET = 24;
const DEFAULT_SPEED = 0.25;
const GOO_STD_DEVIATION = 10;
const GOO_MATRIX_ALPHA_MULTIPLIER = 24;
const GOO_MATRIX_ALPHA_OFFSET = -10;
const CONTENT_BORDER_RADIUS = 18;

export type GooeyPopoverProps = {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  triggerSize?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "bottom";
  sideOffset?: number;
  contentWidth?: number;
  speed?: number;
  bgClassName?: string;
  contentClassName?: string;
  className?: string;
};

export default function GooeyPopover({
  children,
  trigger,
  triggerSize = DEFAULT_TRIGGER_SIZE,
  isOpen: controlledIsOpen,
  onOpenChange,
  side = "top",
  sideOffset = DEFAULT_SIDE_OFFSET,
  contentWidth = DEFAULT_CONTENT_WIDTH,
  speed = DEFAULT_SPEED,
  bgClassName = "bg-neutral-900",
  contentClassName,
  className,
}: GooeyPopoverProps) {
  const filterId = useId();
  const isControlled = controlledIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const filteredContentRef = useRef<HTMLDivElement>(null);
  const unfilteredContentRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange]
  );

  const handleClose = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, setIsOpen]);

  useClickOutside(containerRef, handleClose);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Measure content height
  useEffect(() => {
    const measureHeight = () => {
      if (measureRef.current) {
        const height = measureRef.current.scrollHeight;
        if (height > 0) {
          setContentHeight(height);
        }
      }
    };

    const timeoutId = setTimeout(measureHeight, MEASURE_DELAY_SHORT);
    const timeoutId2 = setTimeout(measureHeight, MEASURE_DELAY_LONG);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [children]);

  const triggerRadius = triggerSize / 2;
  // Position content so its edge clears the trigger with sideOffset gap
  const translateY =
    side === "top" ? -(contentHeight + sideOffset) : triggerSize + sideOffset;
  const contentLeft = triggerRadius - contentWidth / 2;

  // GSAP animations
  useEffect(() => {
    if (contentHeight === 0) {
      return;
    }

    // Kill any running timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const filteredTarget = filteredContentRef.current;
    const unfilteredTarget = unfilteredContentRef.current;
    const innerTarget = innerContentRef.current;

    if (!(unfilteredTarget && innerTarget)) {
      return;
    }

    if (prefersReducedMotion) {
      if (isOpen) {
        setIsVisible(true);
        gsap.set(unfilteredTarget, {
          width: contentWidth,
          height: contentHeight,
          borderRadius: CONTENT_BORDER_RADIUS,
          x: contentLeft,
          y: translateY,
          opacity: 1,
        });
        gsap.set(innerTarget, { opacity: 1, y: 0 });
      } else {
        gsap.set(unfilteredTarget, {
          width: triggerSize,
          height: triggerSize,
          borderRadius: triggerRadius,
          x: 0,
          y: 0,
          opacity: 0,
        });
        gsap.set(innerTarget, { opacity: 0, y: 0 });
        setIsVisible(false);
      }
      return;
    }

    if (isOpen) {
      setIsVisible(true);

      // Start both content shapes as circles at trigger position
      const startProps = {
        width: triggerSize,
        height: triggerSize,
        borderRadius: triggerRadius,
        x: 0,
        y: 0,
        opacity: 1,
      };
      if (filteredTarget) {
        gsap.set(filteredTarget, startProps);
      }
      gsap.set(unfilteredTarget, startProps);
      gsap.set(innerTarget, { opacity: 0, y: 16 });

      const tl = gsap.timeline();

      // Filtered content: morph to rectangle with borderRadius=0
      // The goo filter softens the edges naturally
      if (filteredTarget) {
        tl.to(
          filteredTarget,
          {
            width: contentWidth,
            height: contentHeight,
            borderRadius: 0,
            x: contentLeft,
            y: translateY,
            duration: speed,
            ease: "power1.in",
          },
          0
        );
      }

      // Unfiltered content: morph to rectangle with rounded corners
      tl.to(
        unfilteredTarget,
        {
          width: contentWidth,
          height: contentHeight,
          borderRadius: CONTENT_BORDER_RADIUS,
          x: contentLeft,
          y: translateY,
          duration: speed,
          ease: "power1.in",
        },
        0
      );

      // Content text fade in (overlapping with shape morph)
      tl.to(
        innerTarget,
        {
          opacity: 1,
          y: 0,
          duration: speed * 0.75,
          ease: "power1.out",
        },
        speed * 0.575
      );

      timelineRef.current = tl;
    } else {
      // Content text fade out first
      const tl = gsap.timeline({
        onComplete: () => {
          setIsVisible(false);
        },
      });

      tl.to(innerTarget, {
        opacity: 0,
        y: 8,
        duration: speed * 0.4,
        ease: "power1.in",
      });

      // Shape morph back: rectangle → circle
      const targets = [filteredTarget, unfilteredTarget].filter(Boolean);
      tl.to(
        targets,
        {
          width: triggerSize,
          height: triggerSize,
          borderRadius: triggerRadius,
          x: 0,
          y: 0,
          duration: speed,
          ease: "power1.in",
        },
        speed * 0.2
      );

      // Fade out at the end
      tl.to(
        targets,
        {
          opacity: 0,
          duration: speed * 0.3,
          ease: "power1.in",
        },
        `-=${speed * 0.3}`
      );

      timelineRef.current = tl;
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [
    isOpen,
    contentHeight,
    contentWidth,
    triggerSize,
    triggerRadius,
    contentLeft,
    translateY,
    speed,
    prefersReducedMotion,
  ]);

  const defaultTriggerIcon = (
    <svg
      fill="none"
      height={20}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={20}
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );

  return (
    <div className={cn("relative inline-flex", className)} ref={containerRef}>
      {/* SVG goo filter definition */}
      <svg
        aria-hidden="true"
        className="absolute"
        style={{ width: 0, height: 0 }}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation={GOO_STD_DEVIATION}
            />
            <feColorMatrix
              in="blur"
              result="goo"
              type="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${String(GOO_MATRIX_ALPHA_MULTIPLIER)} ${String(GOO_MATRIX_ALPHA_OFFSET)}`}
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Hidden measurement div */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        ref={measureRef}
        style={{
          width: contentWidth,
          position: "absolute",
          top: -9999,
          left: -9999,
          visibility: "hidden",
        }}
      >
        <div className={cn("p-4", contentClassName)}>{children}</div>
      </div>

      {/* Filtered layer: SVG goo filter creates liquid bridge between blob and content */}
      {!prefersReducedMotion && (isOpen || isVisible) && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ filter: `url(#${filterId})` }}
        >
          {/* Blob: circle at trigger position — stays put while content morphs away */}
          <div
            className={cn("absolute rounded-full", bgClassName)}
            style={{
              width: triggerSize,
              height: triggerSize,
              top: 0,
              left: 0,
            }}
          />

          {/* Content shape: morphs from circle to rectangle (borderRadius=0, goo softens edges) */}
          <div
            className={cn("absolute", bgClassName)}
            ref={filteredContentRef}
            style={{
              top: 0,
              left: 0,
              width: triggerSize,
              height: triggerSize,
              borderRadius: triggerRadius,
              opacity: 0,
            }}
          />
        </div>
      )}

      {/* Trigger button (z-10, sits on top of filtered blob) */}
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full text-white transition-colors",
          bgClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: triggerSize,
          height: triggerSize,
        }}
        type="button"
      >
        {trigger ?? defaultTriggerIcon}
      </button>

      {/* Unfiltered content panel (z-10, clean edges, actual text) */}
      {(isOpen || isVisible) && (
        <div
          className={cn(
            "absolute z-10 overflow-hidden text-white",
            bgClassName
          )}
          ref={unfilteredContentRef}
          role="dialog"
          style={{
            top: 0,
            left: 0,
            width: triggerSize,
            height: triggerSize,
            borderRadius: triggerRadius,
            opacity: 0,
          }}
        >
          <div
            className={cn("p-4", contentClassName)}
            ref={innerContentRef}
            style={{ opacity: 0, transform: "translateY(16px)" }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
