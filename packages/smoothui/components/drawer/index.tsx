"use client";

import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import { cn } from "@repo/smoothui-utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

/* ------------------------------------------------------------------ */
/*  Animation constants                                                */
/* ------------------------------------------------------------------ */

const STAGGER_BASE_DELAY = 0.08;
const STAGGER_CHILD_DELAY = 0.04;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DrawerSide = "top" | "right" | "bottom" | "left";

export interface DrawerProps {
  /** Drawer content */
  children?: ReactNode;
  /** Additional CSS class names */
  className?: string;
  /** Description displayed below the title */
  description?: string;
  /** Footer content */
  footer?: ReactNode;
  /** Callback when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the drawer is open */
  open?: boolean;
  /** The side from which the drawer opens */
  side?: DrawerSide;
  /** Title displayed in the drawer header */
  title?: string;
  /** Trigger element that opens the drawer */
  trigger?: ReactNode;
}

const SIDE_TO_SWIPE: Record<
  DrawerSide,
  NonNullable<ComponentProps<typeof DrawerPrimitive.Root>["swipeDirection"]>
> = {
  bottom: "down",
  left: "left",
  right: "right",
  top: "up",
};

const VIEWPORT_SIDE_CLASS: Record<DrawerSide, string> = {
  bottom: "items-end justify-center",
  left: "items-stretch justify-start",
  right: "items-stretch justify-end",
  top: "items-start justify-center",
};

const POPUP_SIDE_CLASS: Record<DrawerSide, string> = {
  bottom:
    "mt-24 max-h-[80vh] w-full rounded-t-lg border-t data-starting-style:translate-y-[calc(100%-var(--bleed,0px))] data-ending-style:translate-y-[calc(100%-var(--bleed,0px))] [transform:translateY(var(--drawer-swipe-movement-y,0px))]",
  left: "h-full w-3/4 max-w-[100vw] border-r sm:max-w-sm data-starting-style:translate-x-[calc(-100%+var(--bleed,0px))] data-ending-style:translate-x-[calc(-100%+var(--bleed,0px))] [transform:translateX(var(--drawer-swipe-movement-x,0px))]",
  right:
    "h-full w-3/4 max-w-[100vw] border-l sm:max-w-sm data-starting-style:translate-x-[calc(100%-var(--bleed,0px))] data-ending-style:translate-x-[calc(100%-var(--bleed,0px))] [transform:translateX(var(--drawer-swipe-movement-x,0px))]",
  top: "mb-24 max-h-[80vh] w-full rounded-b-lg border-b data-starting-style:translate-y-[calc(-100%+var(--bleed,0px))] data-ending-style:translate-y-[calc(-100%+var(--bleed,0px))] [transform:translateY(var(--drawer-swipe-movement-y,0px))]",
};

/* ------------------------------------------------------------------ */
/*  Thin Base UI wrappers                                              */
/* ------------------------------------------------------------------ */

const DrawerRoot = DrawerPrimitive.Root;

const DrawerTrigger = ({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Trigger>) => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
);

const DrawerPortal = ({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Portal>) => (
  <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
);

const DrawerClose = ({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Close>) => (
  <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
);

const DrawerOverlay = ({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Backdrop>) => (
  <DrawerPrimitive.Backdrop
    className={cn(
      "fixed inset-0 z-50 bg-black/50 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0",
      className
    )}
    data-slot="drawer-overlay"
    {...props}
  />
);

const DrawerContent = ({
  className,
  children,
  side = "bottom",
  ...props
}: ComponentProps<typeof DrawerPrimitive.Popup> & { side?: DrawerSide }) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Viewport
      className={cn("fixed inset-0 z-50 flex p-0", VIEWPORT_SIDE_CLASS[side])}
      data-slot="drawer-viewport"
    >
      <DrawerPrimitive.Popup
        className={cn(
          "flex flex-col bg-background outline-none transition-transform duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:select-none data-swiping:duration-0",
          POPUP_SIDE_CLASS[side],
          className
        )}
        data-side={side}
        data-slot="drawer-content"
        {...props}
      >
        {side === "bottom" ? (
          <div className="mx-auto mt-4 h-2 w-[100px] shrink-0 rounded-full bg-muted" />
        ) : null}
        <DrawerPrimitive.Content className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Viewport>
  </DrawerPortal>
);

const DrawerHeader = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex flex-col gap-0.5 p-4 md:gap-1.5 md:text-left",
      className
    )}
    data-slot="drawer-header"
    {...props}
  />
);

const DrawerFooter = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    data-slot="drawer-footer"
    {...props}
  />
);

const DrawerTitle = ({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Title>) => (
  <DrawerPrimitive.Title
    className={cn("font-semibold text-foreground", className)}
    data-slot="drawer-title"
    {...props}
  />
);

const DrawerDescription = ({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Description>) => (
  <DrawerPrimitive.Description
    className={cn("text-muted-foreground text-sm", className)}
    data-slot="drawer-description"
    {...props}
  />
);

/* ------------------------------------------------------------------ */
/*  Stagger child                                                      */
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
    initial={
      shouldReduceMotion
        ? { opacity: 1 }
        : { opacity: 0, transform: "translateY(6px)" }
    }
    transition={
      shouldReduceMotion
        ? { duration: 0 }
        : {
            bounce: 0,
            delay: STAGGER_BASE_DELAY + index * STAGGER_CHILD_DELAY,
            duration: 0.25,
            type: "spring" as const,
          }
    }
  >
    {children}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/*  Trigger helper                                                     */
/* ------------------------------------------------------------------ */

const renderTrigger = (trigger: ReactNode) => {
  if (!trigger) {
    return null;
  }
  if (isValidElement(trigger)) {
    const element = trigger as ReactElement;
    const nativeButton =
      typeof element.type === "string" ? element.type === "button" : true;
    return <DrawerTrigger nativeButton={nativeButton} render={element} />;
  }
  return <DrawerTrigger>{trigger}</DrawerTrigger>;
};

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
  const [mounted, setMounted] = useState(Boolean(open));

  useEffect(() => {
    if (open) {
      setMounted(true);
    }
  }, [open]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      onOpenChange?.(next);
    },
    [onOpenChange]
  );

  const handleOpenChangeComplete = useCallback((next: boolean) => {
    if (!next) {
      setMounted(false);
    }
  }, []);

  const showPortal = open || mounted;

  return (
    <DrawerRoot
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
      open={open}
      swipeDirection={SIDE_TO_SWIPE[side]}
    >
      {renderTrigger(trigger)}

      {showPortal ? (
        <DrawerContent className={className} side={side}>
          <AnimatePresence>
            {open ? (
              <motion.div
                animate={{ opacity: 1 }}
                className="flex min-h-0 flex-1 flex-col"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                key="drawer-body"
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { duration: 0.2, ease: [0.23, 1, 0.32, 1] }
                }
              >
                {title || description ? (
                  <StaggerChild
                    index={0}
                    shouldReduceMotion={shouldReduceMotion}
                  >
                    <DrawerHeader>
                      {title ? <DrawerTitle>{title}</DrawerTitle> : null}
                      {description ? (
                        <DrawerDescription>{description}</DrawerDescription>
                      ) : null}
                    </DrawerHeader>
                  </StaggerChild>
                ) : null}

                {children ? (
                  <StaggerChild
                    index={title || description ? 1 : 0}
                    shouldReduceMotion={shouldReduceMotion}
                  >
                    <div className="px-4">{children}</div>
                  </StaggerChild>
                ) : null}

                {footer ? (
                  <StaggerChild
                    index={(title || description ? 1 : 0) + (children ? 1 : 0)}
                    shouldReduceMotion={shouldReduceMotion}
                  >
                    <DrawerFooter>{footer}</DrawerFooter>
                  </StaggerChild>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </DrawerContent>
      ) : null}
    </DrawerRoot>
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
