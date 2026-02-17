"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type AnimatedTooltipPlacement = "top" | "bottom" | "left" | "right";

export interface AnimatedTooltipProps {
  /** Content displayed inside the tooltip */
  content: ReactNode;
  /** Placement of the tooltip relative to the trigger */
  placement?: AnimatedTooltipPlacement;
  /** Delay in milliseconds before the tooltip appears */
  delay?: number;
  /** The trigger element the tooltip is anchored to */
  children: ReactNode;
  /** Additional CSS class names for the tooltip container */
  className?: string;
}

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

const placementStyles: Record<AnimatedTooltipPlacement, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<AnimatedTooltipPlacement, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-foreground border-x-transparent border-b-transparent",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-foreground border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-foreground border-y-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-foreground border-y-transparent border-l-transparent",
};

const arrowBorderSize: Record<AnimatedTooltipPlacement, string> = {
  top: "border-4",
  bottom: "border-4",
  left: "border-4",
  right: "border-4",
};

const getInitialTransform = (
  placement: AnimatedTooltipPlacement
): { opacity: number; scale: number; x: number; y: number } => {
  const base = { opacity: 0, scale: 0.95, x: 0, y: 0 };
  switch (placement) {
    case "top":
      return { ...base, y: 4 };
    case "bottom":
      return { ...base, y: -4 };
    case "left":
      return { ...base, x: 4 };
    case "right":
      return { ...base, x: -4 };
  }
};

const AnimatedTooltip = ({
  content,
  placement = "top",
  delay = 0,
  children,
  className,
}: AnimatedTooltipProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const tooltipId = useId();
  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHoverDevice(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const show = useCallback(() => {
    if (delay > 0) {
      delayTimerRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    } else {
      setIsVisible(true);
    }
  }, [delay]);

  const hide = useCallback(() => {
    if (delayTimerRef.current !== null) {
      clearTimeout(delayTimerRef.current);
      delayTimerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        hide();
      }
    },
    [hide]
  );

  const initialTransform = getInitialTransform(placement);

  return (
    <span
      className="relative inline-flex"
      onBlur={hide}
      onFocus={show}
      onKeyDown={handleKeyDown}
      onMouseEnter={isHoverDevice ? show : undefined}
      onMouseLeave={isHoverDevice ? hide : undefined}
    >
      <span aria-describedby={isVisible ? tooltipId : undefined}>
        {children}
      </span>

      <AnimatePresence>
        {isVisible && (
          <motion.span
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, x: 0, y: 0 }
            }
            className={cn(
              "absolute z-50 w-max max-w-xs rounded-md bg-foreground px-3 py-1.5 text-background text-sm shadow-md",
              placementStyles[placement],
              className
            )}
            exit={
              shouldReduceMotion
                ? { opacity: 0, transition: { duration: 0 } }
                : {
                    ...initialTransform,
                    transition: { duration: 0.15 },
                  }
            }
            id={tooltipId}
            initial={shouldReduceMotion ? { opacity: 0 } : initialTransform}
            role="tooltip"
            transition={shouldReduceMotion ? { duration: 0 } : SPRING}
          >
            {content}
            <span
              aria-hidden="true"
              className={cn(
                "absolute block h-0 w-0",
                arrowBorderSize[placement],
                arrowStyles[placement]
              )}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default AnimatedTooltip;
