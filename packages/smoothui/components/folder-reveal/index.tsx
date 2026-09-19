"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type FolderRevealTrigger = "hover" | "click";
export type FolderRevealColor = "manila" | "brand" | "blue" | "green" | "slate";

export interface FolderRevealItem {
  /** Card surface colour. Defaults to the theme background. */
  color?: string;
  content: ReactNode;
  id: string;
}

export interface FolderRevealProps {
  className?: string;
  /** Folder stock: `manila` (default) or a theme-tinted variant. */
  color?: FolderRevealColor;
  items: FolderRevealItem[];
  label?: string;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  /** Degrees of rotation applied per card as the fan spreads. */
  rotation?: number;
  /** Folder width in px. Height follows the folder aspect ratio. */
  size?: number;
  /** Horizontal spread (px) between fanned cards. */
  spread?: number;
  trigger?: FolderRevealTrigger;
}

const DEFAULT_SPREAD = 62;
const DEFAULT_ROTATION = 7;
const DEFAULT_SIZE = 260;

/** Real folders are wider than tall — this ratio is what sells the silhouette. */
const ASPECT = 0.78;
const FLAP_TOP_RATIO = 0.44;
const CARD_WIDTH_RATIO = 0.6;
const CARD_HEIGHT_RATIO = 0.5;
const CARD_BOTTOM_RATIO = 0.16;
const FAN_LIFT_RATIO = 0.36;
const CLOSED_SCALE = 0.97;
const FLAP_OPEN_ROTATE_X = -32;
const STAGGER_STEP = 0.035;
const CLOSE_STAGGER_STEP = 0.018;
const PERSPECTIVE = 1000;
const SHADOW_CLOSED_OPACITY = 0.28;
const SHADOW_OPEN_OPACITY = 0.55;
const SHADOW_CLOSED_SCALE = 0.88;
const SHADOW_OPEN_SCALE = 1.06;

/**
 * Back panel silhouette drawn as one path so the raised tab keeps crisp,
 * correctly-rounded joins at any size. viewBox is 320×250 (= ASPECT).
 * The tab on the top-left is the single detail that makes a shape read
 * as "folder" rather than "rounded rectangle".
 */
const BACK_PANEL_PATH =
  "M 0 14 Q 0 0 14 0 L 108 0 Q 118 0 124 8 L 137 25 Q 143 33 153 33 L 306 33 Q 320 33 320 47 L 320 236 Q 320 250 306 250 L 14 250 Q 0 250 0 236 Z";

interface FolderSkin {
  back: string;
  backDeep: string;
  edge: string;
  flap: string;
  flapDeep: string;
  label: string;
}

/**
 * Stock colours in oklch so each variant keeps one hue across its own ramp
 * and the front flap sits a consistent step lighter than the back panel —
 * that lightness gap is what separates the two planes.
 */
const FOLDER_SKINS: Record<FolderRevealColor, FolderSkin> = {
  blue: {
    back: "oklch(0.56 0.13 250)",
    backDeep: "oklch(0.49 0.14 250)",
    edge: "oklch(0.84 0.07 252)",
    flap: "oklch(0.64 0.14 251)",
    flapDeep: "oklch(0.57 0.15 251)",
    label: "oklch(0.98 0.01 250)",
  },
  brand: {
    back: "oklch(0.63 0.17 352)",
    backDeep: "oklch(0.56 0.18 352)",
    edge: "oklch(0.87 0.08 352)",
    flap: "oklch(0.72 0.17 352)",
    flapDeep: "oklch(0.65 0.18 352)",
    label: "oklch(0.99 0.01 352)",
  },
  green: {
    back: "oklch(0.6 0.11 155)",
    backDeep: "oklch(0.53 0.12 155)",
    edge: "oklch(0.86 0.06 157)",
    flap: "oklch(0.68 0.12 156)",
    flapDeep: "oklch(0.61 0.13 156)",
    label: "oklch(0.99 0.01 155)",
  },
  manila: {
    back: "oklch(0.8 0.075 82)",
    backDeep: "oklch(0.73 0.08 79)",
    edge: "oklch(0.96 0.035 88)",
    flap: "oklch(0.87 0.068 85)",
    flapDeep: "oklch(0.8 0.074 83)",
    label: "oklch(0.4 0.05 68)",
  },
  slate: {
    back: "oklch(0.6 0.018 262)",
    backDeep: "oklch(0.53 0.02 262)",
    edge: "oklch(0.87 0.01 262)",
    flap: "oklch(0.68 0.016 262)",
    flapDeep: "oklch(0.61 0.018 262)",
    label: "oklch(0.99 0 0)",
  },
};

const OPEN_TRANSITION = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};

const FolderReveal = ({
  className,
  color = "manila",
  items,
  label = "Folder",
  onOpenChange,
  open: openProp,
  rotation = DEFAULT_ROTATION,
  size = DEFAULT_SIZE,
  spread = DEFAULT_SPREAD,
  trigger = "hover",
}: FolderRevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;
  const isHoverCapableRef = useRef(false);
  const gradientId = useId();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    isHoverCapableRef.current = mediaQuery.matches;

    const handleChange = (event: MediaQueryListEvent) => {
      isHoverCapableRef.current = event.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const handleMouseEnter = () => {
    if (trigger === "hover" && isHoverCapableRef.current) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === "hover" && isHoverCapableRef.current) {
      setOpen(false);
    }
  };

  const handleFocus = () => {
    if (trigger === "hover") {
      setOpen(true);
    }
  };

  const handleBlur = () => {
    if (trigger === "hover") {
      setOpen(false);
    }
  };

  const handleClick = () => {
    if (trigger === "click") {
      setOpen(!open);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (trigger === "hover" && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setOpen(!open);
    }
  };

  const height = size * ASPECT;
  const flapHeight = height * (1 - FLAP_TOP_RATIO);
  const cardWidth = size * CARD_WIDTH_RATIO;
  const cardHeight = height * CARD_HEIGHT_RATIO;
  const skin = FOLDER_SKINS[color];

  const itemCount = items.length;
  const center = (itemCount - 1) / 2;
  const topCardId = items.at(-1)?.id;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover zone wraps the real button trigger so the whole folder is hoverable
    <div
      className={cn("relative select-none", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        height,
        perspective: shouldReduceMotion ? undefined : PERSPECTIVE,
        width: size,
      }}
    >
      {/* Contact shadow — grows and softens as the folder opens. */}
      <motion.div
        animate={{
          opacity: open ? SHADOW_OPEN_OPACITY : SHADOW_CLOSED_OPACITY,
          scaleX: open ? SHADOW_OPEN_SCALE : SHADOW_CLOSED_SCALE,
        }}
        aria-hidden="true"
        className="absolute -bottom-4 left-1/2 h-6 w-[88%] -translate-x-1/2 rounded-[50%] bg-foreground/45 blur-lg"
        initial={false}
        transition={shouldReduceMotion ? { duration: 0 } : OPEN_TRANSITION}
      />

      {/* Back panel + tab. */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.12)]"
        fill="none"
        viewBox="0 0 320 250"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Folder</title>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={skin.back} />
            <stop offset="100%" stopColor={skin.backDeep} />
          </linearGradient>
        </defs>
        <path d={BACK_PANEL_PATH} fill={`url(#${gradientId})`} />
      </svg>

      {/* Tab label, printed on the raised tab like a real folder. */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 flex items-center truncate px-3 font-semibold text-[11px] tracking-[0.01em]"
        style={{
          color: skin.label,
          height: height * 0.132,
          maxWidth: size * 0.34,
        }}
      >
        {label}
      </span>

      {/* Well — the inner shadow the papers sit in. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[14px]"
        style={{
          boxShadow: "inset 0 14px 16px -14px rgba(0,0,0,0.45)",
          top: height * 0.132,
        }}
      />

      {/* Cards. They peek above the flap when closed and fan when open. */}
      <div
        aria-hidden={!open}
        className="pointer-events-none absolute inset-x-0 flex justify-center"
        style={{ bottom: height * CARD_BOTTOM_RATIO, zIndex: 10 }}
      >
        {items.map((item, index) => {
          const offset = index - center;
          const isTopCard = item.id === topCardId;

          return (
            <motion.div
              animate={
                open
                  ? {
                      opacity: 1,
                      rotate: shouldReduceMotion ? 0 : offset * rotation,
                      scale: 1,
                      x: shouldReduceMotion ? 0 : offset * spread,
                      y: shouldReduceMotion ? 0 : -height * FAN_LIFT_RATIO,
                    }
                  : {
                      opacity: isTopCard || shouldReduceMotion ? 1 : 0,
                      rotate: 0,
                      scale: CLOSED_SCALE,
                      x: 0,
                      y: 0,
                    }
              }
              className="absolute bottom-0 origin-bottom overflow-hidden rounded-[10px] bg-background shadow-[0_1px_2px_rgba(0,0,0,0.08),0_8px_18px_-8px_rgba(0,0,0,0.28)] ring-1 ring-foreground/10"
              initial={false}
              key={item.id}
              style={{
                backgroundColor: item.color,
                height: cardHeight,
                width: cardWidth,
                zIndex: index,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : {
                      ...OPEN_TRANSITION,
                      delay: open
                        ? index * STAGGER_STEP
                        : (itemCount - 1 - index) * CLOSE_STAGGER_STEP,
                    }
              }
            >
              {item.content}
            </motion.div>
          );
        })}
      </div>

      {/* Front flap — overlaps the cards so the illusion holds. */}
      <motion.button
        animate={
          shouldReduceMotion
            ? { rotateX: 0 }
            : { rotateX: open ? FLAP_OPEN_ROTATE_X : 0 }
        }
        aria-expanded={open}
        aria-label={label}
        className="absolute inset-x-0 bottom-0 cursor-pointer rounded-t-[8px] rounded-b-[14px] outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        initial={false}
        onBlur={handleBlur}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        style={{
          backgroundImage: `linear-gradient(to bottom, ${skin.flap}, ${skin.flapDeep})`,
          boxShadow: `inset 0 1px 0 ${skin.edge}, 0 -2px 6px -2px rgba(0,0,0,0.18), 0 10px 22px -12px rgba(0,0,0,0.4)`,
          height: flapHeight,
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
          zIndex: 20,
        }}
        transition={shouldReduceMotion ? { duration: 0 } : OPEN_TRANSITION}
        type="button"
      />
    </div>
  );
};

export default FolderReveal;
