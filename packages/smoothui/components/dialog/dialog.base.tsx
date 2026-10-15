"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@repo/smoothui-utils";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  DURATION,
  OVERLAY_ENTER,
  OVERLAY_ENTER_INITIAL,
  OVERLAY_EXIT,
  OVERLAY_TRANSITION,
} from "../../lib/animation";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DialogProps {
  /** Dialog content */
  children?: ReactNode;
  /** Additional CSS class names for the content */
  className?: string;
  /** Description displayed below the title */
  description?: string;
  /** Footer content */
  footer?: ReactNode;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the dialog is open */
  open?: boolean;
  /** Whether to show the close button */
  showCloseButton?: boolean;
  /** Title displayed in the dialog header */
  title?: string;
  /** Trigger element that opens the dialog */
  trigger?: ReactNode;
}

export interface AlertDialogProps {
  /** Alert dialog content */
  children?: ReactNode;
  /** Additional CSS class names for the content */
  className?: string;
  /** Description displayed below the title */
  description?: string;
  /** Footer content (typically AlertDialogAction + AlertDialogCancel) */
  footer?: ReactNode;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the alert dialog is open */
  open?: boolean;
  /** Title displayed in the alert dialog header */
  title?: string;
  /** Trigger element that opens the alert dialog */
  trigger?: ReactNode;
}

const STAGGER_DELAY = 0.06;

const PANEL_CLASS =
  "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-6 shadow-lg sm:max-w-lg";

const ACTION_CLASS =
  "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const CANCEL_CLASS =
  "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/* ------------------------------------------------------------------ */
/*  Layout helpers (shadcn-parity, no @repo/shadcn-ui)                 */
/* ------------------------------------------------------------------ */

export const DialogHeader = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    data-slot="dialog-header"
    {...props}
  />
);

export const DialogFooter = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    data-slot="dialog-footer"
    {...props}
  />
);

export const DialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn("font-semibold text-lg leading-none", className)}
    data-slot="dialog-title"
    {...props}
  />
);

export const DialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("text-muted-foreground text-sm", className)}
    data-slot="dialog-description"
    {...props}
  />
);

export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export const AlertDialogHeader = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    data-slot="alert-dialog-header"
    {...props}
  />
);

export const AlertDialogFooter = ({
  className,
  ...props
}: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className
    )}
    data-slot="alert-dialog-footer"
    {...props}
  />
);

export const AlertDialogTitle = ({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) => (
  <AlertDialogPrimitive.Title
    className={cn("font-semibold text-lg", className)}
    data-slot="alert-dialog-title"
    {...props}
  />
);

export const AlertDialogDescription = ({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) => (
  <AlertDialogPrimitive.Description
    className={cn("text-muted-foreground text-sm", className)}
    data-slot="alert-dialog-description"
    {...props}
  />
);

export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

/** Confirm action — Base UI has no Action part; maps to Close. */
export const AlertDialogAction = ({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Close>) => (
  <AlertDialogPrimitive.Close
    className={cn(ACTION_CLASS, className)}
    data-slot="alert-dialog-action"
    {...props}
  />
);

/** Cancel action — Base UI has no Cancel part; maps to Close. */
export const AlertDialogCancel = ({
  className,
  ...props
}: ComponentProps<typeof AlertDialogPrimitive.Close>) => (
  <AlertDialogPrimitive.Close
    className={cn(CANCEL_CLASS, className)}
    data-slot="alert-dialog-cancel"
    {...props}
  />
);

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */

const StaggerChild = ({
  children,
  index,
  shouldReduceMotion,
}: {
  children: ReactNode;
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
            bounce: 0,
            delay: index * STAGGER_DELAY,
            duration: 0.25,
            type: "spring" as const,
          }
    }
  >
    {children}
  </motion.div>
);

const AnimatedCloseButton = ({
  shouldReduceMotion,
}: {
  shouldReduceMotion: boolean | null;
}) => (
  <DialogPrimitive.Close
    aria-label="Close dialog"
    className="absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
    render={
      <motion.button
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        type="button"
        whileHover={shouldReduceMotion ? {} : { rotate: 90 }}
      />
    }
  >
    <X aria-hidden="true" className="pointer-events-none size-4 shrink-0" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
);

type TriggerComponent = (props: {
  children?: ReactNode;
  nativeButton?: boolean;
  render?: ReactElement;
}) => ReactElement | null;

const renderTrigger = (Trigger: TriggerComponent, trigger: ReactNode) => {
  if (!trigger) {
    return null;
  }
  if (isValidElement(trigger)) {
    const element = trigger as ReactElement;
    const nativeButton =
      typeof element.type === "string" ? element.type === "button" : true;
    return <Trigger nativeButton={nativeButton} render={element} />;
  }
  return <Trigger>{trigger}</Trigger>;
};

const useDialogOpenState = (
  open: boolean | undefined,
  onOpenChange?: (open: boolean) => void
) => {
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

  return {
    handleAnimationComplete,
    handleOpenChange,
    isOpen,
    setShowContent,
    showContent,
  };
};

/* ------------------------------------------------------------------ */
/*  Dialog                                                             */
/* ------------------------------------------------------------------ */

/**
 * SmoothUI Dialog — Base UI twin (default).
 * Same public props as the Radix twin; headless via `@base-ui/react/dialog`.
 */
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
  const {
    isOpen,
    showContent,
    handleOpenChange,
    handleAnimationComplete,
    setShowContent,
  } = useDialogOpenState(open, onOpenChange);

  return (
    <DialogPrimitive.Root
      onOpenChange={handleOpenChange}
      open={isOpen || showContent}
    >
      {renderTrigger(DialogPrimitive.Trigger, trigger)}

      <AnimatePresence onExitComplete={() => setShowContent(false)}>
        {isOpen ? (
          <DialogPrimitive.Portal keepMounted>
            <DialogPrimitive.Backdrop
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              data-slot="dialog-overlay"
              render={
                <motion.div
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : DURATION.fast + 0.05,
                  }}
                />
              }
            />

            <DialogPrimitive.Popup
              className={cn(PANEL_CLASS, className)}
              data-slot="dialog-content"
              render={
                <motion.div
                  animate={
                    shouldReduceMotion ? { opacity: 1 } : { ...OVERLAY_ENTER }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { ...OVERLAY_EXIT, transition: { duration: 0.15 } }
                  }
                  initial={
                    shouldReduceMotion
                      ? { ...OVERLAY_ENTER }
                      : { ...OVERLAY_ENTER_INITIAL }
                  }
                  onAnimationComplete={handleAnimationComplete}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : OVERLAY_TRANSITION
                  }
                />
              }
            >
              {title || description ? (
                <StaggerChild index={0} shouldReduceMotion={shouldReduceMotion}>
                  <DialogHeader>
                    {title ? <DialogTitle>{title}</DialogTitle> : null}
                    {description ? (
                      <DialogDescription>{description}</DialogDescription>
                    ) : null}
                  </DialogHeader>
                </StaggerChild>
              ) : null}

              {children ? (
                <StaggerChild
                  index={title || description ? 1 : 0}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  {children}
                </StaggerChild>
              ) : null}

              {footer ? (
                <StaggerChild
                  index={(title || description ? 1 : 0) + (children ? 1 : 0)}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  <DialogFooter>{footer}</DialogFooter>
                </StaggerChild>
              ) : null}

              {showCloseButton ? (
                <AnimatedCloseButton shouldReduceMotion={shouldReduceMotion} />
              ) : null}
            </DialogPrimitive.Popup>
          </DialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </DialogPrimitive.Root>
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
  const {
    isOpen,
    showContent,
    handleOpenChange,
    handleAnimationComplete,
    setShowContent,
  } = useDialogOpenState(open, onOpenChange);

  return (
    <AlertDialogPrimitive.Root
      onOpenChange={handleOpenChange}
      open={isOpen || showContent}
    >
      {renderTrigger(AlertDialogPrimitive.Trigger, trigger)}

      <AnimatePresence onExitComplete={() => setShowContent(false)}>
        {isOpen ? (
          <AlertDialogPrimitive.Portal keepMounted>
            <AlertDialogPrimitive.Backdrop
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              data-slot="alert-dialog-overlay"
              render={
                <motion.div
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : DURATION.fast + 0.05,
                  }}
                />
              }
            />

            <AlertDialogPrimitive.Popup
              className={cn(PANEL_CLASS, className)}
              data-slot="alert-dialog-content"
              render={
                <motion.div
                  animate={
                    shouldReduceMotion ? { opacity: 1 } : { ...OVERLAY_ENTER }
                  }
                  exit={
                    shouldReduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : { ...OVERLAY_EXIT, transition: { duration: 0.15 } }
                  }
                  initial={
                    shouldReduceMotion
                      ? { ...OVERLAY_ENTER }
                      : { ...OVERLAY_ENTER_INITIAL }
                  }
                  onAnimationComplete={handleAnimationComplete}
                  transition={
                    shouldReduceMotion ? { duration: 0 } : OVERLAY_TRANSITION
                  }
                />
              }
            >
              {title || description ? (
                <StaggerChild index={0} shouldReduceMotion={shouldReduceMotion}>
                  <AlertDialogHeader>
                    {title ? (
                      <AlertDialogTitle>{title}</AlertDialogTitle>
                    ) : null}
                    {description ? (
                      <AlertDialogDescription>
                        {description}
                      </AlertDialogDescription>
                    ) : null}
                  </AlertDialogHeader>
                </StaggerChild>
              ) : null}

              {children ? (
                <StaggerChild
                  index={title || description ? 1 : 0}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  {children}
                </StaggerChild>
              ) : null}

              {footer ? (
                <StaggerChild
                  index={(title || description ? 1 : 0) + (children ? 1 : 0)}
                  shouldReduceMotion={shouldReduceMotion}
                >
                  <AlertDialogFooter>{footer}</AlertDialogFooter>
                </StaggerChild>
              ) : null}
            </AlertDialogPrimitive.Popup>
          </AlertDialogPrimitive.Portal>
        ) : null}
      </AnimatePresence>
    </AlertDialogPrimitive.Root>
  );
}
