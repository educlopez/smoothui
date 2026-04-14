"use client";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/shadcn-ui/components/ui/alert-dialog";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/shadcn-ui/components/ui/dialog";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertDialog as AlertDialogRadix,
  Dialog as DialogRadix,
} from "radix-ui";
import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Shared animation constants                                        */
/* ------------------------------------------------------------------ */

const SPRING_PANEL = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.05,
};

const BACKDROP_DURATION = 0.2;

const STAGGER_DELAY = 0.06;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DialogProps {
  /** Dialog content */
  children?: React.ReactNode;
  /** Additional CSS class names for the content */
  className?: string;
  /** Description displayed below the title */
  description?: string;
  /** Footer content */
  footer?: React.ReactNode;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the dialog is open */
  open?: boolean;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Title displayed in the dialog header */
  title?: string;
  /** Trigger element that opens the dialog */
  trigger?: React.ReactNode;
}

export interface AlertDialogProps {
  /** Alert dialog content */
  children?: React.ReactNode;
  /** Additional CSS class names for the content */
  className?: string;
  /** Description displayed below the title */
  description?: string;
  /** Footer content (typically AlertDialogAction + AlertDialogCancel) */
  footer?: React.ReactNode;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the alert dialog is open */
  open?: boolean;
  /** Title displayed in the alert dialog header */
  title?: string;
  /** Trigger element that opens the alert dialog */
  trigger?: React.ReactNode;
}

/* ------------------------------------------------------------------ */
/*  Stagger wrapper — animates children in sequence                   */
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
        : {
            opacity: 0,
            transform: "translateY(4px)",
            transition: { duration: 0.12 },
          }
    }
    initial={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 0, transform: "translateY(8px)" }
    }
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : {
            type: "spring" as const,
            duration: 0.25,
            bounce: 0,
            delay: index * STAGGER_DELAY,
          }
    }
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Animated close button with rotate on hover                        */
/* ------------------------------------------------------------------ */

const AnimatedCloseButton = ({
  onClick,
  shouldReduceMotion,
}: {
  onClick: () => void;
  shouldReduceMotion: boolean | null;
}) => (
  <motion.button
    aria-label="Close dialog"
    className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
    onClick={onClick}
    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    type="button"
    whileHover={shouldReduceMotion ? {} : { rotate: 90 }}
  >
    <X aria-hidden="true" className="pointer-events-none size-4 shrink-0" />
    <span className="sr-only">Close</span>
  </motion.button>
);

/* ------------------------------------------------------------------ */
/*  Dialog                                                             */
/* ------------------------------------------------------------------ */

export default function Dialog({
  open,
  onOpenChange,
  title,
  description,
  showCloseButton = true,
  className,
  children,
  trigger,
  footer,
}: DialogProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  // Track mount state for AnimatePresence exit animations
  const [showContent, setShowContent] = useState(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setShowContent(true);
    }
    prevOpenRef.current = !!isOpen;
  }, [isOpen]);

  const handleAnimationComplete = useCallback(() => {
    if (!isOpen) {
      setShowContent(false);
    }
  }, [isOpen]);

  return (
    <DialogRadix.Root
      onOpenChange={handleOpenChange}
      open={isOpen || showContent}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <AnimatePresence onExitComplete={() => setShowContent(false)}>
        {isOpen && (
          <DialogRadix.Portal forceMount>
            {/* Backdrop with blur + opacity fade */}
            <DialogRadix.Overlay asChild forceMount>
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                data-slot="dialog-overlay"
                exit={{ opacity: 0 }}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : BACKDROP_DURATION,
                }}
              />
            </DialogRadix.Overlay>

            {/* Content panel — spring scale + translateY entrance */}
            <DialogRadix.Content asChild forceMount>
              <motion.div
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      }
                }
                className={cn(
                  "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
                  className
                )}
                data-slot="dialog-content"
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : {
                        opacity: 0,
                        transform: "translate(-50%, -50%) scale(0.95)",
                        transition: { duration: 0.15 },
                      }
                }
                initial={
                  shouldReduceMotion
                    ? {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      }
                    : {
                        opacity: 0,
                        transform: "translate(-50%, -48%) scale(0.95)",
                      }
                }
                onAnimationComplete={handleAnimationComplete}
                transition={shouldReduceMotion ? { duration: 0 } : SPRING_PANEL}
              >
                {/* Staggered content sections */}
                {(title || description) && (
                  <StaggerChild
                    index={0}
                    shouldReduceMotion={shouldReduceMotion}
                  >
                    <DialogHeader>
                      {title && <DialogTitle>{title}</DialogTitle>}
                      {description && (
                        <DialogDescription>{description}</DialogDescription>
                      )}
                    </DialogHeader>
                  </StaggerChild>
                )}

                {children && (
                  <StaggerChild
                    index={title || description ? 1 : 0}
                    shouldReduceMotion={shouldReduceMotion}
                  >
                    {children}
                  </StaggerChild>
                )}

                {footer && (
                  <StaggerChild
                    index={(title || description ? 1 : 0) + (children ? 1 : 0)}
                    shouldReduceMotion={shouldReduceMotion}
                  >
                    <DialogFooter>{footer}</DialogFooter>
                  </StaggerChild>
                )}

                {showCloseButton && (
                  <AnimatedCloseButton
                    onClick={() => handleOpenChange(false)}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                )}
              </motion.div>
            </DialogRadix.Content>
          </DialogRadix.Portal>
        )}
      </AnimatePresence>
    </DialogRadix.Root>
  );
}

/* ------------------------------------------------------------------ */
/*  AlertDialog                                                        */
/* ------------------------------------------------------------------ */

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
  trigger,
  footer,
}: AlertDialogProps) {
  const shouldReduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const [showContent, setShowContent] = useState(false);
  const prevOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen && !prevOpenRef.current) {
      setShowContent(true);
    }
    prevOpenRef.current = !!isOpen;
  }, [isOpen]);

  const handleAnimationComplete = useCallback(() => {
    if (!isOpen) {
      setShowContent(false);
    }
  }, [isOpen]);

  return (
    <AlertDialogRadix.Root
      onOpenChange={handleOpenChange}
      open={isOpen || showContent}
    >
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AnimatePresence onExitComplete={() => setShowContent(false)}>
        {isOpen && (
          <AlertDialogRadix.Portal forceMount>
            {/* Backdrop */}
            <AlertDialogRadix.Overlay asChild forceMount>
              <motion.div
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                data-slot="alert-dialog-overlay"
                exit={{ opacity: 0 }}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : BACKDROP_DURATION,
                }}
              />
            </AlertDialogRadix.Overlay>

            {/* Content panel */}
            <AlertDialogRadix.Content asChild forceMount>
              <motion.div
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      }
                }
                className={cn(
                  "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg",
                  className
                )}
                data-slot="alert-dialog-content"
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : {
                        opacity: 0,
                        transform: "translate(-50%, -50%) scale(0.95)",
                        transition: { duration: 0.15 },
                      }
                }
                initial={
                  shouldReduceMotion
                    ? {
                        opacity: 1,
                        transform: "translate(-50%, -50%) scale(1)",
                      }
                    : {
                        opacity: 0,
                        transform: "translate(-50%, -48%) scale(0.95)",
                      }
                }
                onAnimationComplete={handleAnimationComplete}
                transition={shouldReduceMotion ? { duration: 0 } : SPRING_PANEL}
              >
                {(title || description) && (
                  <StaggerChild
                    index={0}
                    shouldReduceMotion={shouldReduceMotion}
                  >
                    <AlertDialogHeader>
                      {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
                      {description && (
                        <AlertDialogDescription>
                          {description}
                        </AlertDialogDescription>
                      )}
                    </AlertDialogHeader>
                  </StaggerChild>
                )}

                {children && (
                  <StaggerChild
                    index={title || description ? 1 : 0}
                    shouldReduceMotion={shouldReduceMotion}
                  >
                    {children}
                  </StaggerChild>
                )}

                {footer && (
                  <StaggerChild
                    index={(title || description ? 1 : 0) + (children ? 1 : 0)}
                    shouldReduceMotion={shouldReduceMotion}
                  >
                    <AlertDialogFooter>{footer}</AlertDialogFooter>
                  </StaggerChild>
                )}
              </motion.div>
            </AlertDialogRadix.Content>
          </AlertDialogRadix.Portal>
        )}
      </AnimatePresence>
    </AlertDialogRadix.Root>
  );
}

/* ------------------------------------------------------------------ */
/*  Re-exports                                                         */
/* ------------------------------------------------------------------ */

export {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
