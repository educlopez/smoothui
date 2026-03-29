"use client";

import {
  Drawer as DrawerPrimitive,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/shadcn-ui/components/ui/drawer";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Animation constants                                                */
/* ------------------------------------------------------------------ */

const BACKDROP_DURATION = 0.2;
const STAGGER_BASE_DELAY = 0.12;
const STAGGER_CHILD_DELAY = 0.05;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DrawerSide = "top" | "right" | "bottom" | "left";

export interface DrawerProps {
  /** Whether the drawer is open */
  open?: boolean;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** The side from which the drawer opens */
  side?: DrawerSide;
  /** Title displayed in the drawer header */
  title?: string;
  /** Description displayed below the title */
  description?: string;
  /** Additional CSS class names */
  className?: string;
  /** Drawer content */
  children?: React.ReactNode;
  /** Trigger element that opens the drawer */
  trigger?: React.ReactNode;
  /** Footer content */
  footer?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Stagger child — animates content items in sequence after open      */
/* ------------------------------------------------------------------ */

const StaggerChild = ({
  children,
  index,
  shouldReduceMotion,
}: {
  children: React.ReactNode;
  index: number;
  shouldReduceMotion: boolean | null;
}) => (
  <motion.div
    animate={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 1, transform: "translateY(0px)" }
    }
    exit={
      shouldReduceMotion
        ? { opacity: 0, transition: { duration: 0 } }
        : { opacity: 0, transition: { duration: 0.1 } }
    }
    initial={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 0, transform: "translateY(6px)" }
    }
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : {
            type: "spring" as const,
            duration: 0.25,
            bounce: 0,
            delay: STAGGER_BASE_DELAY + index * STAGGER_CHILD_DELAY,
          }
    }
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Animated handle bar with glow pulse                                */
/* ------------------------------------------------------------------ */

const AnimatedHandle = ({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean | null;
}) => (
  <motion.div
    animate={
      shouldReduceMotion
        ? {}
        : {
            opacity: [0.5, 1, 0.5],
          }
    }
    className="bg-muted mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full"
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: [0.645, 0.045, 0.355, 1],
          }
    }
  />
);

/* ------------------------------------------------------------------ */
/*  Drawer                                                             */
/* ------------------------------------------------------------------ */

export default function Drawer({
  open,
  onOpenChange,
  side = "bottom",
  title,
  description,
  className,
  children,
  trigger,
  footer,
}: DrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    // When going from open -> closed, we need animation-out time
    if (prevOpenRef.current && !open) {
      setIsAnimatingOut(true);
    }
    prevOpenRef.current = !!open;
  }, [open]);

  const handleExitComplete = useCallback(() => {
    setIsAnimatingOut(false);
  }, []);

  // Keep vaul's drawer open during exit animation so the portal stays mounted
  const vaulOpen = open || isAnimatingOut;

  return (
    <DrawerPrimitive
      direction={side}
      open={vaulOpen}
      onOpenChange={(next) => {
        if (!next && isAnimatingOut) {
          return; // Ignore vaul's close during our exit animation
        }
        onOpenChange?.(next);
      }}
    >
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      {/*
        We render DrawerContent so vaul's drag gestures still work, but we
        layer motion.div overlays on top for the visual polish (backdrop blur,
        spring slide-in, content stagger, handle pulse).
      */}
      <DrawerContent
        className={cn(
          // Hide vaul's default CSS transition — we animate with motion
          "!transition-none !duration-0",
          // Hide the default handle for bottom drawers — we render our own animated one
          side === "bottom" && "[&>[class*='h-2'][class*='rounded-full']]:hidden",
          className,
        )}
      >
        {/* Animated handle for bottom drawers */}
        {side === "bottom" && (
          <AnimatedHandle shouldReduceMotion={shouldReduceMotion} />
        )}

        <AnimatePresence onExitComplete={handleExitComplete}>
          {open && (
            <motion.div
              animate={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : { opacity: 1 }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, transition: { duration: 0.15 } }
              }
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{
                duration: shouldReduceMotion ? 0 : BACKDROP_DURATION,
              }}
            >
              {/* Staggered header */}
              {(title || description) && (
                <StaggerChild index={0} shouldReduceMotion={shouldReduceMotion}>
                  <DrawerHeader>
                    {title && <DrawerTitle>{title}</DrawerTitle>}
                    {description && (
                      <DrawerDescription>{description}</DrawerDescription>
                    )}
                  </DrawerHeader>
                </StaggerChild>
              )}

              {/* Staggered body */}
              {children && (
                <StaggerChild
                  index={title || description ? 1 : 0}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  <div className="px-4">{children}</div>
                </StaggerChild>
              )}

              {/* Staggered footer */}
              {footer && (
                <StaggerChild
                  index={
                    (title || description ? 1 : 0) + (children ? 1 : 0)
                  }
                  shouldReduceMotion={shouldReduceMotion}
                >
                  <DrawerFooter>{footer}</DrawerFooter>
                </StaggerChild>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </DrawerContent>
    </DrawerPrimitive>
  );
}

/* ------------------------------------------------------------------ */
/*  Re-exports                                                         */
/* ------------------------------------------------------------------ */

export {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
