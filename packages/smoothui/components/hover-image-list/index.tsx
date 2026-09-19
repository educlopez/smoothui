"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import type { FocusEvent, PointerEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface HoverImageListItem {
  alt: string;
  href?: string;
  id: string;
  image: string;
  meta?: string;
  title: string;
}

export type HoverImageListRevealMode = "cursor" | "fixed";

export interface HoverImageListProps {
  className?: string;
  follow?: boolean;
  imageSize?: number;
  items: HoverImageListItem[];
  revealMode?: HoverImageListRevealMode;
}

type ActivationSource = "focus" | "pointer" | null;

const DEFAULT_IMAGE_SIZE = 240;
const SPRING_CONFIG = { damping: 26, stiffness: 260 };
const SKEW_SPRING_CONFIG = { damping: 18, stiffness: 220 };
const MAX_SKEW = 8;
const SKEW_FACTOR = 0.12;
const MAX_FRAME_DELTA_MS = 50;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const HoverImageList = ({
  className,
  follow = true,
  imageSize = DEFAULT_IMAGE_SIZE,
  items,
  revealMode = "cursor",
}: HoverImageListProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activationSource, setActivationSource] =
    useState<ActivationSource>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointerRef = useRef<{ t: number; x: number; y: number } | null>(
    null
  );
  const pendingPointerRef = useRef<{ x: number; y: number } | null>(null);
  const frameRequestedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const skew = useMotionValue(0);
  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);
  const springSkew = useSpring(skew, SKEW_SPRING_CONFIG);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverDevice(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(
    () => () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    },
    []
  );

  const isFixedPosition =
    shouldReduceMotion ||
    !isHoverDevice ||
    activationSource === "focus" ||
    revealMode === "fixed";

  const activateRow = (index: number, source: ActivationSource) => {
    setActiveIndex(index);
    setActivationSource(source);
  };

  const deactivateRow = (source: ActivationSource) => {
    setActiveIndex((current) => (current === null ? current : null));
    setActivationSource((current) => (current === source ? null : current));
  };

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (isFixedPosition) {
        return;
      }

      pendingPointerRef.current = { x: event.clientX, y: event.clientY };

      if (frameRequestedRef.current) {
        return;
      }
      frameRequestedRef.current = true;

      rafIdRef.current = requestAnimationFrame((now) => {
        frameRequestedRef.current = false;
        const pending = pendingPointerRef.current;
        const container = containerRef.current;
        if (!(pending && container)) {
          return;
        }

        const rect = container.getBoundingClientRect();
        const localX = pending.x - rect.left;
        const localY = pending.y - rect.top;

        if (follow) {
          let vx = 0;
          if (lastPointerRef.current) {
            const dt = Math.min(
              now - lastPointerRef.current.t,
              MAX_FRAME_DELTA_MS
            );
            if (dt > 0) {
              vx = (localX - lastPointerRef.current.x) / dt;
            }
          }
          lastPointerRef.current = { t: now, x: localX, y: localY };
          skew.set(clamp(vx * SKEW_FACTOR, -MAX_SKEW, MAX_SKEW));
        }

        x.set(localX - imageSize / 2);
        y.set(localY - imageSize / 2);
      });
    },
    [isFixedPosition, follow, imageSize, skew, x, y]
  );

  const handleListPointerLeave = () => {
    deactivateRow("pointer");
    lastPointerRef.current = null;
  };

  const handleListBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (
      activationSource === "focus" &&
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      deactivateRow("focus");
    }
  };

  const activeItem = activeIndex === null ? null : items[activeIndex];

  const previewPositionStyle = isFixedPosition
    ? { height: imageSize, width: imageSize }
    : {
        height: imageSize,
        left: 0,
        top: 0,
        width: imageSize,
        x: follow ? springX : x,
        y: follow ? springY : y,
      };

  const renderRowContent = (item: HoverImageListItem): ReactNode => (
    <>
      <span className="flex flex-col gap-1">
        <span className="font-medium text-foreground text-lg transition-colors duration-200 group-hover:text-brand">
          {item.title}
        </span>
        {item.meta ? (
          <span className="text-muted-foreground text-sm">{item.meta}</span>
        ) : null}
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </>
  );

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: only tracks pointer/focus leaving the list bounds to clear the preview
    <div
      className={cn("relative", className)}
      onBlur={handleListBlur}
      onPointerLeave={handleListPointerLeave}
      onPointerMove={handlePointerMove}
      ref={containerRef}
    >
      <ul className="flex flex-col">
        {items.map((item, index) => (
          <li
            className="border-foreground/10 border-b last:border-b-0"
            key={item.id}
          >
            {item.href ? (
              <a
                className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-200"
                href={item.href}
                onFocus={() => activateRow(index, "focus")}
                onMouseEnter={() => {
                  if (isHoverDevice) {
                    activateRow(index, "pointer");
                  }
                }}
              >
                {renderRowContent(item)}
              </a>
            ) : (
              <button
                className="group flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-200"
                onFocus={() => activateRow(index, "focus")}
                onMouseEnter={() => {
                  if (isHoverDevice) {
                    activateRow(index, "pointer");
                  }
                }}
                type="button"
              >
                {renderRowContent(item)}
              </button>
            )}
          </li>
        ))}
      </ul>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? { opacity: activeItem ? 1 : 0 }
              : { opacity: activeItem ? 1 : 0, scale: activeItem ? 1 : 0.94 }
          }
          className={cn(
            "absolute overflow-hidden rounded-2xl shadow-xl",
            isFixedPosition && "top-1/2 right-6 -translate-y-1/2"
          )}
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.94 }}
          style={{
            ...previewPositionStyle,
            skewX: shouldReduceMotion || isFixedPosition ? 0 : springSkew,
          }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { bounce: 0.1, duration: 0.25, type: "spring" }
          }
        >
          <AnimatePresence initial={false}>
            {activeItem ? (
              <motion.img
                alt={activeItem.alt}
                animate={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }
                }
                className="absolute inset-0 h-full w-full object-cover"
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, scale: 0.96 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.96 }
                }
                key={activeItem.id}
                src={activeItem.image}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { bounce: 0.1, duration: 0.25, type: "spring" }
                }
              />
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default HoverImageList;
