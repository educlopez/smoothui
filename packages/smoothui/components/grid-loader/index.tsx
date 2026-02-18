"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";

// Grid matrix type: 3x3 array of 0s and 1s
export type GridMatrix = [
  [0 | 1, 0 | 1, 0 | 1],
  [0 | 1, 0 | 1, 0 | 1],
  [0 | 1, 0 | 1, 0 | 1],
];

// All preset pattern names
export type PresetPattern =
  // Solo (single cell)
  | "solo-center"
  | "solo-tl"
  | "solo-tr"
  | "solo-bl"
  | "solo-br"
  // Horizontal lines
  | "line-h-top"
  | "line-h-mid"
  | "line-h-bot"
  // Vertical lines
  | "line-v-left"
  | "line-v-mid"
  | "line-v-right"
  // Diagonals
  | "line-diag-1"
  | "line-diag-2"
  // Corners
  | "corners-only"
  | "corners-sync"
  | "corners"
  // Plus
  | "plus-hollow"
  | "plus-full"
  // L-shapes
  | "L-tl"
  | "L-tr"
  | "L-bl"
  | "L-br"
  // T-shapes
  | "T-top"
  | "T-bot"
  | "T-left"
  | "T-right"
  // Duo
  | "duo-h"
  | "duo-v"
  | "duo-diag"
  // Frame
  | "frame"
  | "frame-sync"
  // Sparse
  | "sparse-1"
  | "sparse-2"
  | "sparse-3"
  // Waves
  | "wave-lr"
  | "wave-rl"
  | "wave-tb"
  | "wave-bt"
  // Diagonal quadrants
  | "diagonal-tl"
  | "diagonal-tr"
  | "diagonal-bl"
  | "diagonal-br"
  // Ripple
  | "ripple-out"
  | "ripple-in"
  // Shapes
  | "cross"
  | "x-shape"
  | "diamond"
  // Stripes
  | "stripes-h"
  | "stripes-v"
  // Patterns
  | "checkerboard"
  | "rows-alt"
  // Spirals
  | "spiral-cw"
  | "spiral-ccw"
  // Snake
  | "snake"
  | "snake-rev"
  // Rain
  | "rain"
  | "rain-rev"
  // Effects
  | "waterfall"
  | "breathing"
  | "heartbeat"
  | "twinkle"
  | "sparkle"
  | "chaos"
  // Edge
  | "edge-cw"
  | "border";

export interface GridLoaderProps {
  /** Pattern to display - preset name or custom 3x3 matrix */
  pattern?: PresetPattern | GridMatrix;
  /** Animation mode */
  mode?: "pulse" | "sequence" | "stagger";
  /** Array of patterns for sequence mode */
  sequence?: Array<PresetPattern | GridMatrix>;
  /** Animation speed */
  speed?: "slow" | "normal" | "fast";
  /** Color preset or custom CSS color */
  color?: "white" | "red" | "blue" | "green" | "amber" | string;
  /** Size preset or pixel value */
  size?: "sm" | "md" | "lg" | "xl" | number;
  /** Blur amount in pixels — creates a soft glow effect */
  blur?: number;
  /** Gap between cells in pixels */
  gap?: number;
  /** Use rounded (circular) cells instead of square */
  rounded?: boolean;
  /** Disable animation and show static pattern */
  static?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Preset patterns as 3x3 matrices
const PATTERNS: Record<PresetPattern, GridMatrix> = {
  // Solo (single cell)
  "solo-center": [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  "solo-tl": [
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  "solo-tr": [
    [0, 0, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  "solo-bl": [
    [0, 0, 0],
    [0, 0, 0],
    [1, 0, 0],
  ],
  "solo-br": [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 1],
  ],

  // Horizontal lines
  "line-h-top": [
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  "line-h-mid": [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  "line-h-bot": [
    [0, 0, 0],
    [0, 0, 0],
    [1, 1, 1],
  ],

  // Vertical lines
  "line-v-left": [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
  ],
  "line-v-mid": [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  "line-v-right": [
    [0, 0, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],

  // Diagonals
  "line-diag-1": [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  "line-diag-2": [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ],

  // Corners
  "corners-only": [
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1],
  ],
  "corners-sync": [
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1],
  ],
  corners: [
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1],
  ],

  // Plus
  "plus-hollow": [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],
  "plus-full": [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],

  // L-shapes
  "L-tl": [
    [1, 1, 0],
    [1, 0, 0],
    [0, 0, 0],
  ],
  "L-tr": [
    [0, 1, 1],
    [0, 0, 1],
    [0, 0, 0],
  ],
  "L-bl": [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
  ],
  "L-br": [
    [0, 0, 0],
    [0, 0, 1],
    [0, 1, 1],
  ],

  // T-shapes
  "T-top": [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0],
  ],
  "T-bot": [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  "T-left": [
    [1, 0, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
  "T-right": [
    [0, 0, 1],
    [0, 1, 1],
    [0, 0, 1],
  ],

  // Duo (two cells)
  "duo-h": [
    [0, 0, 0],
    [1, 1, 0],
    [0, 0, 0],
  ],
  "duo-v": [
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  "duo-diag": [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],

  // Frame
  frame: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "frame-sync": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],

  // Sparse
  "sparse-1": [
    [1, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
  ],
  "sparse-2": [
    [0, 1, 0],
    [1, 0, 0],
    [0, 0, 1],
  ],
  "sparse-3": [
    [0, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ],

  // Waves
  "wave-lr": [
    [1, 1, 0],
    [1, 1, 0],
    [1, 1, 0],
  ],
  "wave-rl": [
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
  ],
  "wave-tb": [
    [1, 1, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  "wave-bt": [
    [0, 0, 0],
    [1, 1, 1],
    [1, 1, 1],
  ],

  // Diagonal quadrants
  "diagonal-tl": [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 0],
  ],
  "diagonal-tr": [
    [0, 1, 1],
    [0, 1, 1],
    [0, 0, 0],
  ],
  "diagonal-bl": [
    [0, 0, 0],
    [1, 1, 0],
    [1, 1, 0],
  ],
  "diagonal-br": [
    [0, 0, 0],
    [0, 1, 1],
    [0, 1, 1],
  ],

  // Ripple
  "ripple-out": [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
  "ripple-in": [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],

  // Shapes
  cross: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  "x-shape": [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ],
  diamond: [
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],

  // Stripes
  "stripes-h": [
    [1, 1, 1],
    [0, 0, 0],
    [1, 1, 1],
  ],
  "stripes-v": [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],

  // Patterns
  checkerboard: [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ],
  "rows-alt": [
    [1, 1, 1],
    [0, 0, 0],
    [1, 1, 1],
  ],

  // Spirals
  "spiral-cw": [
    [1, 1, 1],
    [0, 0, 1],
    [0, 0, 1],
  ],
  "spiral-ccw": [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],

  // Snake
  snake: [
    [1, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  "snake-rev": [
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],

  // Rain
  rain: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  "rain-rev": [
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],

  // Effects
  waterfall: [
    [1, 1, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  breathing: [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  heartbeat: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ],
  twinkle: [
    [1, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
  ],
  sparkle: [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ],
  chaos: [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 0],
  ],

  // Edge
  "edge-cw": [
    [1, 1, 1],
    [0, 0, 0],
    [0, 0, 0],
  ],
  border: [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
  ],
};

// Color presets
const COLORS: Record<string, string> = {
  white: "#f5f5f4",
  red: "#f87171",
  blue: "#38bdf8",
  green: "#4ade80",
  amber: "#fbbf24",
};

// Size presets in pixels
const SIZES: Record<string, number> = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 64,
};

// Speed presets in milliseconds
const SPEEDS: Record<string, number> = {
  slow: 1500,
  normal: 800,
  fast: 400,
};

// Helper to resolve pattern to GridMatrix
const resolvePattern = (
  pattern: PresetPattern | GridMatrix | undefined
): GridMatrix => {
  if (!pattern) {
    return PATTERNS["plus-hollow"];
  }
  if (typeof pattern === "string") {
    return PATTERNS[pattern] ?? PATTERNS["plus-hollow"];
  }
  return pattern;
};

// Helper to resolve color
const resolveColor = (color: string | undefined): string => {
  if (!color) {
    return COLORS.white;
  }
  return COLORS[color] ?? color;
};

// Helper to resolve size
const resolveSize = (
  size: "sm" | "md" | "lg" | "xl" | number | undefined
): number => {
  if (size === undefined) {
    return SIZES.md;
  }
  if (typeof size === "number") {
    return size;
  }
  return SIZES[size] ?? SIZES.md;
};

// Cell component for individual grid cells
const GridCell = ({
  active,
  color,
  cellSize,
  animationDelay,
  mode,
  cycleDuration,
  shouldReduceMotion,
  rounded,
}: {
  active: boolean;
  color: string;
  cellSize: number;
  animationDelay: number;
  mode: "pulse" | "sequence" | "stagger";
  cycleDuration: number;
  shouldReduceMotion: boolean | null;
  rounded?: boolean;
}) => {
  const glowSize = cellSize * 0.8;
  const borderRadius = rounded ? "50%" : undefined;

  if (!active) {
    return (
      <div
        style={{
          width: cellSize,
          height: cellSize,
        }}
      />
    );
  }

  // For reduced motion, show static cells
  if (shouldReduceMotion) {
    return (
      <div
        style={{
          width: cellSize,
          height: cellSize,
          backgroundColor: color,
          borderRadius,
          boxShadow: `
            0 0 ${glowSize * 0.3}px ${color},
            0 0 ${glowSize * 0.6}px ${color}40,
            0 0 ${glowSize * 1.2}px ${color}20
          `,
        }}
      />
    );
  }

  const pulseAnimation = {
    opacity: [0.4, 1, 0.4],
    scale: [0.95, 1, 0.95],
  };

  const staggerAnimation = {
    opacity: [0, 1, 1, 0],
    scale: [0.8, 1, 1, 0.8],
  };

  return (
    <motion.div
      animate={mode === "stagger" ? staggerAnimation : pulseAnimation}
      style={{
        width: cellSize,
        height: cellSize,
        backgroundColor: color,
        borderRadius,
        boxShadow: `
          0 0 ${glowSize * 0.3}px ${color},
          0 0 ${glowSize * 0.6}px ${color}40,
          0 0 ${glowSize * 1.2}px ${color}20
        `,
      }}
      transition={{
        duration: cycleDuration / 1000,
        repeat: Number.POSITIVE_INFINITY,
        ease: [0.645, 0.045, 0.355, 1],
        delay: mode === "stagger" ? animationDelay : 0,
        times: mode === "stagger" ? [0, 0.2, 0.8, 1] : undefined,
      }}
    />
  );
};

const GridLoader = ({
  pattern,
  mode = "pulse",
  sequence,
  speed = "normal",
  color,
  size,
  blur,
  gap: gapProp,
  rounded,
  static: isStatic,
  className,
}: GridLoaderProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [sequenceIndex, setSequenceIndex] = useState(0);

  const sizeInPx = resolveSize(size);
  const gapSize = gapProp ?? 0;
  const cellSize = (sizeInPx - gapSize * 2) / 3;
  const resolvedColor = resolveColor(color);
  const cycleDuration = SPEEDS[speed] ?? SPEEDS.normal;
  const disableAnimation = isStatic || shouldReduceMotion;

  // Handle sequence mode
  useEffect(() => {
    if (mode !== "sequence" || !sequence || sequence.length === 0) {
      return;
    }
    if (disableAnimation) {
      return;
    }

    const interval = setInterval(() => {
      setSequenceIndex((prev) => (prev + 1) % sequence.length);
    }, cycleDuration);

    return () => clearInterval(interval);
  }, [mode, sequence, cycleDuration, disableAnimation]);

  // Determine current grid to display
  const currentGrid = useMemo(() => {
    if (mode === "sequence" && sequence && sequence.length > 0) {
      return resolvePattern(sequence[sequenceIndex]);
    }
    return resolvePattern(pattern);
  }, [mode, sequence, sequenceIndex, pattern]);

  // Flatten grid for rendering
  const cells = currentGrid.flat();

  // Calculate stagger delays based on active cells
  const staggerDelays = useMemo(() => {
    if (mode !== "stagger") {
      return cells.map(() => 0);
    }

    const activeCells = cells.reduce<number[]>((acc, cell, idx) => {
      if (cell === 1) {
        acc.push(idx);
      }
      return acc;
    }, []);

    const delayPerCell = cycleDuration / 1000 / (activeCells.length + 2);

    return cells.map((cell, idx) => {
      if (cell === 0) {
        return 0;
      }
      const activeIndex = activeCells.indexOf(idx);
      return activeIndex * delayPerCell;
    });
  }, [cells, mode, cycleDuration]);

  // Generate stable keys for grid positions (0-8 in a 3x3 grid)
  const cellKeys = ["tl", "tm", "tr", "ml", "mm", "mr", "bl", "bm", "br"];

  return (
    <output
      aria-label="Loading"
      className={cn("grid grid-cols-3", className)}
      style={{
        width: sizeInPx,
        height: sizeInPx,
        gap: gapSize,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {cells.map((active, idx) => (
        <GridCell
          active={active === 1}
          animationDelay={staggerDelays[idx]}
          cellSize={cellSize}
          color={resolvedColor}
          cycleDuration={cycleDuration}
          key={cellKeys[idx]}
          mode={mode}
          rounded={rounded}
          shouldReduceMotion={disableAnimation}
        />
      ))}
    </output>
  );
};

export default GridLoader;

// Export patterns for advanced usage
export { PATTERNS, COLORS, SIZES };
