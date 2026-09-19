"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";

export const MORPH_ICON_VARIANTS = [
  "sidebar",
  "list",
  "grid",
  "compact",
  "menu",
  "search",
  "play",
  "check",
] as const;

export type MorphIconVariant = (typeof MORPH_ICON_VARIANTS)[number];

export type MorphIconProps = {
  active?: boolean;
  className?: string;
  color?: string;
  duration?: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  variant: MorphIconVariant;
};

const DEFAULT_SIZE = 24;
const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_DURATION = 0.3;
const MOVEMENT_EASE: [number, number, number, number] = [
  0.645, 0.045, 0.355, 1,
];
const INSTANT = { duration: 0 };

type Transition = { duration: number; ease?: [number, number, number, number] };

const SidebarGlyph = ({
  active,
  transition,
}: {
  active: boolean;
  transition: Transition;
}) => (
  <>
    <rect height="18" rx="2" width="18" x="3" y="3" />
    <motion.line
      animate={{
        x1: active ? 15 : 9,
        x2: active ? 15 : 9,
        y1: 3,
        y2: 21,
      }}
      transition={transition}
    />
  </>
);

const ListGlyph = ({
  active,
  transition,
}: {
  active: boolean;
  transition: Transition;
}) => (
  <>
    <motion.rect
      animate={
        active ? { height: 14, rx: 1, y: 5 } : { height: 2, rx: 1, y: 11 }
      }
      transition={transition}
      width="2"
      x="2"
    />
    {[7, 12, 17].map((y) => (
      <motion.line
        animate={{ x1: active ? 8 : 4, x2: 20, y1: y, y2: y }}
        key={y}
        transition={transition}
      />
    ))}
  </>
);

const GRID_CELLS = [
  { x: 4, y: 4 },
  { x: 13, y: 4 },
  { x: 4, y: 13 },
  { x: 13, y: 13 },
];

const GridGlyph = ({
  active,
  transition,
}: {
  active: boolean;
  transition: Transition;
}) => (
  <>
    {GRID_CELLS.map((cell) => (
      <motion.rect
        animate={
          active
            ? { height: 6, rx: 3, width: 6, x: cell.x + 0.5, y: cell.y + 0.5 }
            : { height: 7, rx: 1, width: 7, x: cell.x, y: cell.y }
        }
        key={`${cell.x}-${cell.y}`}
        transition={transition}
      />
    ))}
  </>
);

const COMPACT_SPREAD = [6, 12, 18];
const COMPACT_TIGHT = [9, 12, 15];

const CompactGlyph = ({
  active,
  transition,
}: {
  active: boolean;
  transition: Transition;
}) => (
  <>
    {COMPACT_SPREAD.map((y, index) => (
      <motion.line
        animate={{
          x1: 4,
          x2: 20,
          y1: active ? COMPACT_TIGHT[index] : y,
          y2: active ? COMPACT_TIGHT[index] : y,
        }}
        key={y}
        transition={transition}
      />
    ))}
  </>
);

const MenuGlyph = ({
  active,
  transition,
}: {
  active: boolean;
  transition: Transition;
}) => (
  <>
    <motion.line
      animate={
        active
          ? { x1: 6, x2: 18, y1: 6, y2: 18 }
          : { x1: 4, x2: 20, y1: 6, y2: 6 }
      }
      transition={transition}
    />
    <motion.line
      animate={{ opacity: active ? 0 : 1, x1: 4, x2: 20, y1: 12, y2: 12 }}
      transition={transition}
    />
    <motion.line
      animate={
        active
          ? { x1: 6, x2: 18, y1: 18, y2: 6 }
          : { x1: 4, x2: 20, y1: 18, y2: 18 }
      }
      transition={transition}
    />
  </>
);

const SearchGlyph = ({
  active,
  transition,
}: {
  active: boolean;
  transition: Transition;
}) => (
  <>
    <motion.circle
      animate={{ cx: 10, cy: 10, r: active ? 7 : 6 }}
      transition={transition}
    />
    <motion.line
      animate={
        active
          ? { x1: 15, x2: 20.5, y1: 15, y2: 20.5 }
          : { x1: 14.5, x2: 19, y1: 14.5, y2: 19 }
      }
      transition={transition}
    />
  </>
);

const PLAY_PATH = "M8,5 L8,19 L17,12 L17,12 Z";
const STOP_PATH = "M7,7 L7,17 L17,17 L17,7 Z";

const PlayGlyph = ({
  active,
  color,
  transition,
}: {
  active: boolean;
  color: string;
  transition: Transition;
}) => (
  <motion.path
    animate={{ d: active ? STOP_PATH : PLAY_PATH }}
    fill={color}
    stroke="none"
    transition={transition}
  />
);

const CheckGlyph = ({
  active,
  color,
  transition,
}: {
  active: boolean;
  color: string;
  transition: Transition;
}) => (
  <>
    <rect height="16" rx="4" width="16" x="4" y="4" />
    <motion.rect
      animate={{ opacity: active ? 1 : 0 }}
      fill={color}
      height="16"
      rx="4"
      stroke="none"
      transition={transition}
      width="16"
      x="4"
      y="4"
    />
    <motion.path
      animate={{
        opacity: active ? 1 : 0,
        pathLength: active ? 1 : 0,
      }}
      d="M7 12.5 L10.5 16 L17 8"
      stroke="var(--color-background)"
      transition={transition}
    />
  </>
);

export default function MorphIcon({
  variant,
  active = false,
  size = DEFAULT_SIZE,
  strokeWidth = DEFAULT_STROKE_WIDTH,
  color = "currentColor",
  duration = DEFAULT_DURATION,
  label,
  className,
}: MorphIconProps) {
  const shouldReduceMotion = useReducedMotion();
  const transition: Transition = shouldReduceMotion
    ? INSTANT
    : { duration, ease: MOVEMENT_EASE };

  return (
    <svg
      aria-hidden={label ? undefined : "true"}
      className={cn("shrink-0", className)}
      fill="none"
      height={size}
      role={label ? "img" : undefined}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      {label ? <title>{label}</title> : null}
      {variant === "sidebar" && (
        <SidebarGlyph active={active} transition={transition} />
      )}
      {variant === "list" && (
        <ListGlyph active={active} transition={transition} />
      )}
      {variant === "grid" && (
        <GridGlyph active={active} transition={transition} />
      )}
      {variant === "compact" && (
        <CompactGlyph active={active} transition={transition} />
      )}
      {variant === "menu" && (
        <MenuGlyph active={active} transition={transition} />
      )}
      {variant === "search" && (
        <SearchGlyph active={active} transition={transition} />
      )}
      {variant === "play" && (
        <PlayGlyph active={active} color={color} transition={transition} />
      )}
      {variant === "check" && (
        <CheckGlyph active={active} color={color} transition={transition} />
      )}
    </svg>
  );
}
