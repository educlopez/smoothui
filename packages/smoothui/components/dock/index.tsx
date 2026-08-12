"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  AnimatePresence,
  animate,
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const DEFAULT_BASE_SIZE = 48;
const DEFAULT_GAP = 10;
const DEFAULT_MAGNIFICATION = 1.55;
/** ~3x the item pitch, so growth tapers off across 2-3 neighbours. */
const DEFAULT_DISTANCE = 174;
const CHROME_PADDING = 8;
const HALF = 0.5;
const QUARTER = 0.25;
const POINTER_SOLVE_STEPS = 3;
const TRACK_SPRING = { bounce: 0, duration: 0.18 };
const INFLUENCE_SPRING = { bounce: 0, duration: 0.28 };
const TOOLTIP_DURATION = 0.14;
const TOOLTIP_HIDDEN_SCALE = 0.94;
const BOUNCE_DURATION = 0.6;
const BOUNCE_PEAK = -0.4;
const BOUNCE_ECHO = -0.13;
const BOUNCE_TIMES = [0, 0.3, 0.58, 0.8, 1];
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_IN: [number, number, number, number] = [0.55, 0, 1, 0.45];

export type DockOrientation = "horizontal" | "vertical";

export interface DockItem {
  /** Draws the macOS "app is running" dot beside the tile. */
  active?: boolean;
  href?: string;
  icon: ReactNode;
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface DockProps {
  /** Resting edge length of every tile, in px. */
  baseSize?: number;
  className?: string;
  /** Radius of cursor influence in px. Around 3x the item pitch reads best. */
  distance?: number;
  /** Resting space between tiles, in px. */
  gap?: number;
  items: DockItem[];
  /** Scale of the tile directly under the cursor. */
  magnification?: number;
  orientation?: DockOrientation;
  /** Keep every label visible instead of only on hover/focus. */
  showLabels?: boolean;
}

type DockField = {
  baseSize: number;
  count: number;
  distance: number;
  gap: number;
  influence: number;
  magnification: number;
  pointer: number;
};

/**
 * Raised-cosine falloff: flat near the cursor, flat at the edge of the
 * influence radius. A linear ramp is what makes a dock look like only the
 * hovered icon reacts — this curve gives the neighbours real growth and lets
 * the wave die out smoothly.
 */
const falloffAt = (delta: number, distance: number) => {
  const spread = Math.abs(delta);
  if (spread >= distance) {
    return 0;
  }
  return (Math.cos((Math.PI * spread) / distance) + 1) * HALF;
};

/**
 * Signed integral of `falloffAt` from 0 to `delta`. Laying the row out by
 * integrating the local stretch is what makes every tile push its neighbours
 * by exactly the space its own growth needs — no overlap, no guesswork.
 */
const falloffIntegral = (delta: number, distance: number) => {
  const sign = delta < 0 ? -1 : 1;
  const spread = Math.min(Math.abs(delta), distance);
  return (
    sign *
    ((distance / (2 * Math.PI)) * Math.sin((Math.PI * spread) / distance) +
      spread * HALF)
  );
};

const restingCenter = (index: number, field: DockField) =>
  index * (field.baseSize + field.gap) + field.baseSize * HALF;

const gainOf = (field: DockField) =>
  field.influence * (field.magnification - 1);

const scaleAt = (index: number, field: DockField) =>
  1 +
  gainOf(field) *
    falloffAt(restingCenter(index, field) - field.pointer, field.distance);

/** Shift that keeps the magnified row centred on its resting centre. */
const centreShift = (field: DockField) => {
  const first = restingCenter(0, field) - field.pointer;
  const last = restingCenter(field.count - 1, field) - field.pointer;
  return (
    (falloffIntegral(first, field.distance) +
      falloffIntegral(last, field.distance)) *
      HALF +
    field.baseSize *
      (falloffAt(last, field.distance) - falloffAt(first, field.distance)) *
      QUARTER
  );
};

const centreAt = (index: number, field: DockField) => {
  const resting = restingCenter(index, field);
  return (
    resting +
    gainOf(field) *
      (falloffIntegral(resting - field.pointer, field.distance) -
        centreShift(field))
  );
};

const rowLength = (field: DockField) => {
  const last = Math.max(0, field.count - 1);
  const start = centreAt(0, field) - field.baseSize * scaleAt(0, field) * HALF;
  const end =
    centreAt(last, field) + field.baseSize * scaleAt(last, field) * HALF;
  return end - start;
};

/**
 * The cursor arrives in rendered pixels, but the layout is defined in resting
 * coordinates. `rendered = pointer - gain * centreShift(pointer)` is smooth and
 * near-identity, so a few fixed-point steps invert it well enough — and that
 * keeps the magnified peak glued to the cursor, instead of drifting the way a
 * live `getBoundingClientRect` feedback loop does.
 */
const solvePointer = (rendered: number, field: DockField) => {
  const gain = gainOf(field);
  const probe: DockField = { ...field, pointer: rendered };
  for (let step = 0; step < POINTER_SOLVE_STEPS; step += 1) {
    probe.pointer = rendered + gain * centreShift(probe);
  }
  return probe.pointer;
};

const useHoverCapable = () => {
  const [isHoverCapable, setIsHoverCapable] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverCapable(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverCapable(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isHoverCapable;
};

type DockIconElement = HTMLAnchorElement | HTMLButtonElement;

type DockIconProps = {
  baseSize: number;
  fieldRef: { current: DockField };
  index: number;
  influence: MotionValue<number>;
  isTooltipInstant: boolean;
  item: DockItem;
  onFocusItem: () => void;
  onKeyDown: (event: ReactKeyboardEvent<DockIconElement>) => void;
  onPointerEnter: () => void;
  orientation: DockOrientation;
  pointer: MotionValue<number>;
  registerRef: (element: DockIconElement | null) => void;
  shouldReduceMotion: boolean;
  showTooltip: boolean;
  tabIndex: number;
};

const DockIcon = ({
  baseSize,
  fieldRef,
  index,
  influence,
  isTooltipInstant,
  item,
  onFocusItem,
  onKeyDown,
  onPointerEnter,
  orientation,
  pointer,
  registerRef,
  shouldReduceMotion,
  showTooltip,
  tabIndex,
}: DockIconProps) => {
  const isHorizontal = orientation === "horizontal";
  const bounce = useMotionValue(0);

  const offset = useTransform([pointer, influence], (latest: number[]) => {
    const field: DockField = {
      ...fieldRef.current,
      influence: latest[1],
      pointer: latest[0],
    };
    return centreAt(index, field) - field.baseSize * HALF;
  });

  const scale = useTransform([pointer, influence], (latest: number[]) => {
    const field: DockField = {
      ...fieldRef.current,
      influence: latest[1],
      pointer: latest[0],
    };
    return scaleAt(index, field);
  });

  /** Ride above the magnified tile instead of overlapping it. */
  const tooltipShift = useTransform(scale, (value) => -(value - 1) * baseSize);

  const handleSelect = () => {
    if (!shouldReduceMotion) {
      bounce.jump(0);
      animate(
        bounce,
        [0, BOUNCE_PEAK * baseSize, 0, BOUNCE_ECHO * baseSize, 0],
        {
          duration: BOUNCE_DURATION,
          ease: [EASE_OUT, EASE_IN, EASE_OUT, EASE_IN],
          times: BOUNCE_TIMES,
        }
      );
    }
    item.onSelect?.();
  };

  const sharedProps = {
    "aria-label": item.active ? `${item.label} (running)` : item.label,
    className:
      "flex size-full items-center justify-center rounded-[26%] bg-foreground/[0.07] text-foreground outline-none ring-1 ring-foreground/10 ring-inset transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-brand active:scale-[0.94] motion-reduce:transition-none motion-reduce:active:scale-100",
    onClick: handleSelect,
    onFocus: onFocusItem,
    onKeyDown,
    tabIndex,
  };

  return (
    <motion.li
      className={cn(
        "absolute list-none",
        isHorizontal ? "bottom-0 left-0" : "top-0 right-0"
      )}
      onPointerEnter={onPointerEnter}
      style={{
        height: baseSize,
        width: baseSize,
        ...(isHorizontal ? { x: offset } : { y: offset }),
      }}
    >
      <AnimatePresence>
        {showTooltip ? (
          <motion.span
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "pointer-events-none absolute z-20 whitespace-nowrap rounded-md bg-foreground px-2 py-1 font-medium text-[11px] text-background shadow-sm",
              isHorizontal
                ? "bottom-full left-1/2 mb-2.5"
                : "top-1/2 right-full mr-2.5"
            )}
            exit={{ opacity: 0, scale: TOOLTIP_HIDDEN_SCALE }}
            initial={{ opacity: 0, scale: TOOLTIP_HIDDEN_SCALE }}
            key="tooltip"
            style={
              isHorizontal
                ? { originY: 1, x: "-50%", y: tooltipShift }
                : { originX: 1, x: tooltipShift, y: "-50%" }
            }
            transition={{
              duration:
                shouldReduceMotion || isTooltipInstant ? 0 : TOOLTIP_DURATION,
              ease: EASE_OUT,
            }}
          >
            {item.label}
          </motion.span>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="size-full"
        style={{
          scale,
          transformOrigin: isHorizontal ? "bottom center" : "right center",
          ...(isHorizontal ? { y: bounce } : { x: bounce }),
        }}
      >
        {item.href ? (
          <a href={item.href} ref={registerRef} {...sharedProps}>
            {item.icon}
          </a>
        ) : (
          <button ref={registerRef} type="button" {...sharedProps}>
            {item.icon}
          </button>
        )}
      </motion.div>

      {item.active ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute size-[3px] rounded-full bg-foreground/45",
            isHorizontal
              ? "-bottom-1.5 left-1/2 -translate-x-1/2"
              : "top-1/2 -right-1.5 -translate-y-1/2"
          )}
        />
      ) : null}
    </motion.li>
  );
};

export default function Dock({
  baseSize = DEFAULT_BASE_SIZE,
  className,
  distance = DEFAULT_DISTANCE,
  gap = DEFAULT_GAP,
  items,
  magnification = DEFAULT_MAGNIFICATION,
  orientation = "horizontal",
  showLabels = false,
}: DockProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const isHoverCapable = useHoverCapable();
  const isHorizontal = orientation === "horizontal";
  const isMagnetic = isHoverCapable && !shouldReduceMotion;

  const count = items.length;
  const restingLength = Math.max(baseSize, count * (baseSize + gap) - gap);

  const fieldRef = useRef<DockField>({
    baseSize,
    count,
    distance,
    gap,
    influence: 0,
    magnification,
    pointer: 0,
  });
  fieldRef.current = {
    baseSize,
    count,
    distance,
    gap,
    influence: 0,
    magnification: isMagnetic ? magnification : 1,
    pointer: 0,
  };

  const frameRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(DockIconElement | null)[]>([]);
  const isTrackingRef = useRef(false);
  const hasOpenTooltipRef = useRef(false);

  const rawPointer = useMotionValue(0);
  const rawInfluence = useMotionValue(0);
  const smoothPointer = useSpring(rawPointer, TRACK_SPRING);
  const influence = useSpring(rawInfluence, INFLUENCE_SPRING);

  const fieldPointer = useTransform(
    [smoothPointer, influence],
    (latest: number[]) =>
      solvePointer(latest[0], { ...fieldRef.current, influence: latest[1] })
  );

  /** The bar hugs the magnified row, so it widens with it and never jumps. */
  const barLength = useTransform(
    [fieldPointer, influence],
    (latest: number[]) =>
      rowLength({
        ...fieldRef.current,
        influence: latest[1],
        pointer: latest[0],
      }) +
      CHROME_PADDING * 2
  );

  const [focusedIndex, setFocusedIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isTooltipInstant, setIsTooltipInstant] = useState(false);

  const releasePointer = () => {
    isTrackingRef.current = false;
    rawInfluence.set(0);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const frame = frameRef.current;
    if (!(isMagnetic && frame)) {
      return;
    }
    const rect = frame.getBoundingClientRect();
    const value = isHorizontal
      ? event.clientX - rect.left
      : event.clientY - rect.top;

    if (!isTrackingRef.current) {
      rawPointer.jump(value);
      smoothPointer.jump(value);
      isTrackingRef.current = true;
    }
    rawPointer.set(value);
    rawInfluence.set(1);
  };

  const handlePointerLeave = () => {
    releasePointer();
    setHoveredId(null);
    setIsTooltipInstant(false);
    hasOpenTooltipRef.current = false;
  };

  const handleItemPointerEnter = (id: string) => {
    if (!isHoverCapable) {
      return;
    }
    setIsTooltipInstant(hasOpenTooltipRef.current);
    hasOpenTooltipRef.current = true;
    setHoveredId(id);
  };

  const focusItem = (index: number) => {
    if (count === 0) {
      return;
    }
    const nextIndex = (index + count) % count;
    setFocusedIndex(nextIndex);
    itemRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<DockIconElement>) => {
    const forwardKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const backwardKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

    if (event.key === forwardKey) {
      event.preventDefault();
      focusItem(focusedIndex + 1);
    } else if (event.key === backwardKey) {
      event.preventDefault();
      focusItem(focusedIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(count - 1);
    }
  };

  const handleFocusItem = (index: number, id: string) => {
    setFocusedIndex(index);
    setHoveredId(id);
    if (shouldReduceMotion) {
      return;
    }
    const target = restingCenter(index, fieldRef.current);
    rawPointer.jump(target);
    smoothPointer.jump(target);
    isTrackingRef.current = true;
    rawInfluence.set(1);
  };

  const handleBlur = (event: ReactFocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setHoveredId(null);
    releasePointer();
  };

  const axisReserve = CHROME_PADDING + (magnification - 1) * distance * HALF;
  const crossReserve = CHROME_PADDING + baseSize * (magnification - 1);

  return (
    <nav
      aria-label="Application dock"
      className={cn("relative inline-flex", className)}
      onBlur={handleBlur}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      style={
        isHorizontal
          ? {
              paddingBottom: CHROME_PADDING,
              paddingLeft: axisReserve,
              paddingRight: axisReserve,
              paddingTop: crossReserve,
            }
          : {
              paddingBottom: axisReserve,
              paddingLeft: crossReserve,
              paddingRight: CHROME_PADDING,
              paddingTop: axisReserve,
            }
      }
    >
      {/* Fixed resting-size frame — the stable coordinate space the cursor is
          measured against, so no layout in here can ever jump. */}
      <div
        className="relative"
        ref={frameRef}
        style={
          isHorizontal
            ? { height: baseSize, width: restingLength }
            : { height: restingLength, width: baseSize }
        }
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 rounded-[18px] border border-foreground/10 border-t-foreground/20 bg-background/65 shadow-black/10 shadow-lg backdrop-blur-xl"
          style={
            isHorizontal
              ? {
                  height: baseSize + CHROME_PADDING * 2,
                  width: barLength,
                  x: "-50%",
                  y: "-50%",
                }
              : {
                  height: barLength,
                  width: baseSize + CHROME_PADDING * 2,
                  x: "-50%",
                  y: "-50%",
                }
          }
        />

        <ul
          aria-orientation={orientation}
          className="absolute inset-0"
          role="toolbar"
        >
          {items.map((item, index) => (
            <DockIcon
              baseSize={baseSize}
              fieldRef={fieldRef}
              index={index}
              influence={influence}
              isTooltipInstant={isTooltipInstant}
              item={item}
              key={item.id}
              onFocusItem={() => handleFocusItem(index, item.id)}
              onKeyDown={handleKeyDown}
              onPointerEnter={() => handleItemPointerEnter(item.id)}
              orientation={orientation}
              pointer={fieldPointer}
              registerRef={(element) => {
                itemRefs.current[index] = element;
              }}
              shouldReduceMotion={shouldReduceMotion}
              showTooltip={showLabels || hoveredId === item.id}
              tabIndex={index === focusedIndex ? 0 : -1}
            />
          ))}
        </ul>
      </div>
    </nav>
  );
}
