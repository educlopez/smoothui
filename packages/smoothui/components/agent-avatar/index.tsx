"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useEffect, useRef } from "react";

export type AgentAvatarProps = Omit<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  "children"
> & {
  /** String seed to generate a unique deterministic avatar pattern */
  seed: string;
  /** Diameter in pixels */
  size?: number;
  /** Enable pixel animation (respects prefers-reduced-motion) */
  animated?: boolean;
};

const GRID_SIZE = 6;

/** Pulse: each pixel oscillates lightness independently */
const PULSE_SPEED = 0.002;
const PULSE_AMPLITUDE = 22;

/** Breathe: global slow scale oscillation */
const BREATHE_SPEED = 0.001;
const BREATHE_AMPLITUDE = 10;

/** Wave: diagonal sweep across the grid */
const WAVE_SPEED = 0.0015;
const WAVE_AMPLITUDE = 15;
const WAVE_LENGTH = 3;

/** Sparkle: random bright flashes */
const SPARKLE_SPEED = 0.004;
const SPARKLE_THRESHOLD = 0.92;
const SPARKLE_BOOST = 25;

/** Scale pulse: whole avatar breathes in size */
const SCALE_PULSE_SPEED = 0.0008;
const SCALE_PULSE_AMOUNT = 0.03;

/** Max hue spread from base — wider for richer color variation */
const HUE_SPREAD = 45;

const GLOW_RADIUS_RATIO = 0.25;

/** Simple deterministic hash from a string */
const hashSeed = (str: string): number => {
  let hash = 0;
  for (const char of str) {
    hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }
  return Math.abs(hash);
};

/** Seeded PRNG (mulberry32) */
const createRng = (seed: number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d_2b_79_f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
};

type HSL = [hue: number, saturation: number, lightness: number];

/** Derive a 3-color palette within the same hue family */
const generatePalette = (hash: number): [HSL, HSL, HSL] => {
  const rng = createRng(hash);
  const baseHue = rng() * 360;
  const sat = 75 + rng() * 20; // 75-95%

  return [
    [baseHue, sat, 55 + rng() * 10],
    [
      (baseHue - HUE_SPREAD + rng() * HUE_SPREAD * 2) % 360,
      sat - 5 + rng() * 10,
      40 + rng() * 15,
    ],
    [
      (baseHue - HUE_SPREAD + rng() * HUE_SPREAD * 2) % 360,
      sat - 10 + rng() * 15,
      60 + rng() * 15,
    ],
  ];
};

type Cell = {
  colorIndex: number;
  phase: number;
  brightness: number;
  sparklePhase: number;
};

/** Build a grid with per-cell metadata */
const generateGrid = (hash: number): Cell[][] => {
  const rng = createRng(hash + 1);
  const grid: Cell[][] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      grid[y][x] = {
        colorIndex: Math.floor(rng() * 3),
        phase: rng() * Math.PI * 2,
        brightness: 0.3 + rng() * 0.7,
        sparklePhase: rng() * Math.PI * 2,
      };
    }
  }

  return grid;
};

const AgentAvatar = ({
  seed,
  size = 64,
  animated = true,
  className,
  ...props
}: AgentAvatarProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const hash = hashSeed(seed);
    const palette = generatePalette(hash);
    const grid = generateGrid(hash);
    const cellSize = size / GRID_SIZE;
    const half = size / 2;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let shouldAnimate = animated && !motionQuery.matches;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, size, size);

      // Scale pulse — whole avatar breathes
      const scale = shouldAnimate
        ? 1 + Math.sin(time * SCALE_PULSE_SPEED) * SCALE_PULSE_AMOUNT
        : 1;

      ctx.save();
      ctx.translate(half, half);
      ctx.scale(scale, scale);
      ctx.translate(-half, -half);

      // Clip to circle
      ctx.beginPath();
      ctx.arc(half, half, half, 0, Math.PI * 2);
      ctx.clip();

      // Dark background
      ctx.fillStyle = "#08080f";
      ctx.fillRect(0, 0, size, size);

      // Global breathe offset for lightness
      const breatheOffset = shouldAnimate
        ? Math.sin(time * BREATHE_SPEED) * BREATHE_AMPLITUDE
        : 0;

      // Draw pixel grid
      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const cell = grid[y][x];
          const [h, s, l] = palette[cell.colorIndex];

          // Per-pixel pulse
          const pulse = shouldAnimate
            ? Math.sin(time * PULSE_SPEED + cell.phase) * PULSE_AMPLITUDE
            : 0;

          // Diagonal wave sweep
          const waveDist = (x + y) / WAVE_LENGTH;
          const wave = shouldAnimate
            ? Math.sin(time * WAVE_SPEED + waveDist) * WAVE_AMPLITUDE
            : 0;

          // Sparkle — occasional bright flash
          const sparkleVal = shouldAnimate
            ? Math.sin(time * SPARKLE_SPEED + cell.sparklePhase)
            : 0;
          const sparkle = sparkleVal > SPARKLE_THRESHOLD
            ? (sparkleVal - SPARKLE_THRESHOLD) / (1 - SPARKLE_THRESHOLD) * SPARKLE_BOOST
            : 0;

          const finalLight = Math.min(
            90,
            Math.max(20, (l + pulse + breatheOffset + wave + sparkle) * cell.brightness)
          );
          const finalSat = Math.min(100, s + 5);

          // Pixel glow — subtle shadow per cell
          ctx.shadowColor = `hsl(${h}, ${finalSat}%, ${finalLight}%)`;
          ctx.shadowBlur = cellSize * 0.45;

          ctx.fillStyle = `hsl(${h}, ${finalSat}%, ${finalLight}%)`;
          ctx.fillRect(
            x * cellSize,
            y * cellSize,
            cellSize,
            cellSize
          );
        }
      }

      // Reset shadow before restore
      ctx.shadowBlur = 0;
      ctx.restore();

      // Outer glow ring
      const [gh, gs, gl] = palette[0];
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.shadowColor = `hsla(${gh}, ${gs}%, ${gl}%, 0.6)`;
      ctx.shadowBlur = size * GLOW_RADIUS_RATIO;
      ctx.beginPath();
      ctx.arc(half, half, half - 1, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${gh}, ${gs}%, ${gl}%, 0.15)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      if (shouldAnimate) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };

    const handleMotionChange = () => {
      cancelAnimationFrame(rafRef.current);
      shouldAnimate = animated && !motionQuery.matches;
      if (shouldAnimate) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        draw(0);
      }
    };

    motionQuery.addEventListener("change", handleMotionChange);

    if (shouldAnimate) {
      rafRef.current = requestAnimationFrame(draw);
    } else {
      draw(0);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, [seed, size, animated]);

  return (
    <canvas
      aria-label={`Avatar for ${seed}`}
      className={cn("rounded-full", className)}
      ref={canvasRef}
      role="img"
      style={{ width: size, height: size }}
      {...props}
    />
  );
};

export default AgentAvatar;
