"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type ExpandableNavbarItem = {
  id: string;
  label: string;
  panel: ReactNode;
};

export type ExpandableNavbarProps = {
  className?: string;
  closeDelay?: number;
  items: ExpandableNavbarItem[];
  onOpenChange?: (id: string | null) => void;
  openId?: string | null;
  openOnHover?: boolean;
  width?: number | string;
};

const DEFAULT_CLOSE_DELAY = 200;
const SLIDE_DISTANCE = 16;
const HEIGHT_SPRING = { bounce: 0.08, duration: 0.3, type: "spring" as const };
const PANEL_TRANSITION = {
  duration: 0.2,
  ease: [0.645, 0.045, 0.355, 1] as [number, number, number, number],
};

export default function ExpandableNavbar({
  items,
  openId: controlledOpenId,
  onOpenChange,
  openOnHover = true,
  closeDelay = DEFAULT_CLOSE_DELAY,
  width = 640,
  className,
}: ExpandableNavbarProps) {
  const shouldReduceMotion = useReducedMotion();
  const generatedId = useId();
  const navRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const visiblePanelRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousIndexRef = useRef(-1);

  const [internalOpenId, setInternalOpenId] = useState<string | null>(null);
  const [height, setHeight] = useState<number | "auto">(0);
  const [direction, setDirection] = useState(1);

  const isControlled = controlledOpenId !== undefined;
  const openId = isControlled ? controlledOpenId : internalOpenId;
  const activeIndex = items.findIndex((item) => item.id === openId);
  const activeItem = activeIndex >= 0 ? items[activeIndex] : null;

  const setOpenId = useCallback(
    (id: string | null) => {
      if (!isControlled) {
        setInternalOpenId(id);
      }
      onOpenChange?.(id);
    },
    [isControlled, onOpenChange]
  );

  useEffect(() => {
    if (activeIndex >= 0) {
      if (previousIndexRef.current >= 0) {
        setDirection(activeIndex > previousIndexRef.current ? 1 : -1);
      }
      previousIndexRef.current = activeIndex;
    }
  }, [activeIndex]);

  useLayoutEffect(() => {
    const measureNode = measureRef.current;
    if (!measureNode) {
      return;
    }
    const nextHeight = activeItem ? measureNode.scrollHeight : 0;

    setHeight((previousHeight) => {
      if (previousHeight === "auto" && visiblePanelRef.current) {
        const snapshot = visiblePanelRef.current.getBoundingClientRect();
        requestAnimationFrame(() => setHeight(nextHeight));
        return snapshot.height;
      }
      return nextHeight;
    });
  }, [activeItem]);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenId(null);
    }, closeDelay);
  }, [clearCloseTimeout, closeDelay, setOpenId]);

  useEffect(() => clearCloseTimeout, [clearCloseTimeout]);

  const handleItemEnter = (id: string) => {
    if (!openOnHover) {
      return;
    }
    clearCloseTimeout();
    setOpenId(id);
  };

  const handlePanelLeave = () => {
    if (!openOnHover) {
      return;
    }
    scheduleClose();
  };

  const handleItemClick = (id: string) => {
    clearCloseTimeout();
    setOpenId(openId === id ? null : id);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && openId !== null) {
      event.preventDefault();
      setOpenId(null);
    }
  };

  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocused = event.relatedTarget as Node | null;
    if (!(nextFocused && navRef.current?.contains(nextFocused))) {
      setOpenId(null);
    }
  };

  useEffect(() => {
    if (!openId) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenId(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [openId, setOpenId]);

  return (
    <nav
      aria-label="Expandable navigation"
      className={cn(
        "relative rounded-2xl border border-foreground/10 bg-background shadow-lg",
        className
      )}
      onBlurCapture={handleBlurCapture}
      onKeyDown={handleKeyDown}
      onPointerLeave={handlePanelLeave}
      ref={navRef}
      style={{ width }}
    >
      <ul className="flex items-center gap-1 p-2">
        {items.map((item) => {
          const isOpen = item.id === openId;
          const panelId = `expandable-navbar-${generatedId}-${item.id}`;
          return (
            <li key={item.id}>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className={cn(
                  "rounded-lg px-3 py-2 font-medium text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand",
                  isOpen
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => handleItemClick(item.id)}
                onFocus={() => handleItemEnter(item.id)}
                onPointerEnter={() => handleItemEnter(item.id)}
                type="button"
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Hidden mirror used to measure the target panel height without
          waiting for the visible cross-fade animation to settle. */}
      <div
        aria-hidden="true"
        className="invisible absolute inset-x-0 top-0"
        ref={measureRef}
        style={{ pointerEvents: "none" }}
      >
        <div className="p-4">{activeItem?.panel}</div>
      </div>

      <motion.div
        animate={{
          height: shouldReduceMotion ? (activeItem ? "auto" : 0) : height,
        }}
        className="overflow-hidden"
        initial={false}
        onAnimationComplete={() => {
          if (activeItem) {
            setHeight("auto");
          }
        }}
        transition={shouldReduceMotion ? { duration: 0 } : HEIGHT_SPRING}
      >
        <div className="relative" ref={visiblePanelRef}>
          <AnimatePresence custom={direction} initial={false} mode="wait">
            {activeItem ? (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, x: direction * -SLIDE_DISTANCE }
                }
                id={`expandable-navbar-${generatedId}-${activeItem.id}`}
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction * SLIDE_DISTANCE }
                }
                key={activeItem.id}
                role="region"
                transition={
                  shouldReduceMotion ? { duration: 0 } : PANEL_TRANSITION
                }
              >
                <div className="p-4">{activeItem.panel}</div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
    </nav>
  );
}
