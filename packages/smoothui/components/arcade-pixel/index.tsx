"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

/**
 * 5x7 pixel font glyphs expressed as readable row strings ("#" = lit pixel,
 * "." = blank pixel). Converted to numeric grids in PIXEL_FONT_5X7 below.
 */
const FONT_GLYPH_ROWS: Record<string, string[]> = {
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
  "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
  ",": [".....", ".....", ".....", ".....", "..#..", "..#..", ".#..."],
  ":": [".....", "..#..", "..#..", ".....", "..#..", "..#..", "....."],
  "!": ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."],
  "?": [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],
  ".": [".....", ".....", ".....", ".....", ".....", "..#..", "..#.."],
  "*": [".....", "#.#.#", ".###.", "#####", ".###.", "#.#.#", "....."],
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": [".###.", "#...#", "....#", "..##.", "....#", "#...#", ".###."],
  "4": ["#...#", "#...#", "#...#", "#####", "....#", "....#", "....#"],
  "5": ["#####", "#....", "#....", "####.", "....#", "....#", "####."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "..#..", "..#..", "..#..", "..#.."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "#...#", ".###."],
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".####", "#....", "#....", "#..##", "#...#", "#...#", ".####"],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "#####"],
  J: ["..###", "...#.", "...#.", "...#.", "...#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#.#.#", "#..##", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "#.#.#", ".#.#."],
  X: ["#...#", "#...#", ".#.#.", "..#..", ".#.#.", "#...#", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
};

/** Glyph grid dimensions. */
const FONT_COLUMNS = 5;
const FONT_ROWS = 7;
/** Blank columns inserted between characters when building a text grid. */
const CHARACTER_SPACING_COLUMNS = 1;
const CHARACTER_UNIT_WIDTH = FONT_COLUMNS + CHARACTER_SPACING_COLUMNS;

const BLANK_CELL_CHARACTERS = new Set([".", " "]);

/**
 * Row strings accept "." or " " for an unlit cell, "#" for palette index 1, and
 * a digit for any other palette index, so sprites can be multi-colour.
 */
const characterToCellValue = (character: string): number => {
  if (BLANK_CELL_CHARACTERS.has(character)) {
    return 0;
  }
  const parsed = Number.parseInt(character, 10);
  return Number.isNaN(parsed) ? 1 : parsed;
};

const rowsToGrid = (rows: string[]): number[][] =>
  rows.map((row) => Array.from(row, characterToCellValue));

/** Numeric 5x7 pixel font map (0 = blank, 1 = lit), keyed by uppercase character. */
export const PIXEL_FONT_5X7: Record<string, number[][]> = Object.fromEntries(
  Object.entries(FONT_GLYPH_ROWS).map(([character, rows]) => [
    character,
    rowsToGrid(rows),
  ])
);

/**
 * Ready-made sprites so the `sprite` path is usable without hand-authoring a
 * grid. `alien` and `alienAlt` are the two frames of a space-invader style
 * marcher: alternate them on a timer to animate it.
 */
export const ARCADE_SPRITES: Record<string, number[][]> = {
  alien: rowsToGrid([
    "..#.....#..",
    "...#...#...",
    "..#######..",
    ".##.###.##.",
    "###########",
    "#.#######.#",
    "#.#.....#.#",
    "...##.##...",
  ]),
  alienAlt: rowsToGrid([
    "..#.....#..",
    "#..#...#..#",
    "#.#######.#",
    "###.###.###",
    "###########",
    ".#########.",
    "..#.....#..",
    ".##.....##.",
  ]),
  arrow: rowsToGrid([
    "....#....",
    "....##...",
    "....###..",
    "########.",
    "#########",
    "########.",
    "....###..",
    "....##...",
    "....#....",
  ]),
  heart: rowsToGrid([
    ".###.###.",
    "#22######",
    "#2#######",
    "#########",
    ".#######.",
    "..#####..",
    "...###...",
    "....#....",
  ]),
};

const BLANK_GLYPH_GRID = rowsToGrid(
  Array.from({ length: FONT_ROWS }, () => ".".repeat(FONT_COLUMNS))
);

const getGlyphGrid = (character: string): number[][] =>
  PIXEL_FONT_5X7[character.toUpperCase()] ?? BLANK_GLYPH_GRID;

const buildTextGrid = (text: string): number[][] => {
  const characters = text.length > 0 ? Array.from(text) : [" "];
  const rows: number[][] = Array.from(
    { length: FONT_ROWS },
    () => [] as number[]
  );

  for (const [index, character] of characters.entries()) {
    const glyph = getGlyphGrid(character);
    for (let rowIndex = 0; rowIndex < FONT_ROWS; rowIndex++) {
      rows[rowIndex].push(...glyph[rowIndex]);
      if (index < characters.length - 1) {
        rows[rowIndex].push(0);
      }
    }
  }

  return rows;
};

const resolveGrid = (sprite?: number[][], text?: string): number[][] => {
  if (sprite && sprite.length > 0) {
    return sprite;
  }
  if (typeof text === "string") {
    return buildTextGrid(text);
  }
  return BLANK_GLYPH_GRID;
};

/**
 * `fillStyle` cannot resolve CSS custom properties, so `var(--token)` palette
 * entries are read off the live element before the first paint.
 */
const CSS_VARIABLE_PATTERN = /^var\(\s*(--[\w-]+)\s*(?:,\s*([\s\S]+))?\)$/;
const FALLBACK_COLOR = "#ffffff";

const resolveColor = (element: HTMLElement, color: string): string => {
  const match = CSS_VARIABLE_PATTERN.exec(color.trim());
  if (!match) {
    return color;
  }
  const computed = getComputedStyle(element).getPropertyValue(match[1]).trim();
  if (computed) {
    return computed;
  }
  return match[2] ? resolveColor(element, match[2].trim()) : FALLBACK_COLOR;
};

/**
 * Palettes arrive as arrays, which are a fresh reference on every render when
 * written inline. Serialising them gives the render effect a stable dependency.
 * The separator is a unit separator rather than a space, because a modern colour
 * such as `oklch(0.72 0.2 145)` contains spaces of its own.
 */
const PALETTE_SEPARATOR = "\u001f";

type FrameState = {
  done: boolean;
  /** Column range currently landing with a type-reveal flash. */
  flashEnd: number;
  flashStart: number;
  offsetColumns: number;
  revealedColumns: number;
  visible: boolean;
};

type PaintOptions = {
  bloomAlpha: number;
  columnsInView: number;
  frame: FrameState;
  grid: number[][];
  height: number;
  matrixColor: string;
  palette: string[];
  /** Column span after which the grid repeats, for a seamless marquee. */
  period: number;
  pixelSize: number;
  stride: number;
  width: number;
};

const isSameFrame = (a: FrameState, b: FrameState): boolean =>
  a.visible === b.visible &&
  a.revealedColumns === b.revealedColumns &&
  a.offsetColumns === b.offsetColumns &&
  a.flashStart === b.flashStart &&
  a.flashEnd === b.flashEnd;

const FLASH_COLOR = "#ffffff";
const BLOOM_BLUR_PX = 5;
const MATRIX_ALPHA = 0.07;

/** Crisp, opaque pixels: one fillRect per lit cell. */
const paintLitPixels = (
  ctx: CanvasRenderingContext2D,
  options: PaintOptions
): void => {
  const { frame, period, pixelSize, stride, width } = options;
  const repeats = period > 0 ? [0, period] : [0];

  for (const [rowIndex, row] of options.grid.entries()) {
    const y = rowIndex * stride;
    for (const [columnIndex, value] of row.entries()) {
      if (!value || columnIndex >= frame.revealedColumns) {
        continue;
      }
      const isFlashing =
        columnIndex >= frame.flashStart && columnIndex < frame.flashEnd;
      const color = isFlashing
        ? FLASH_COLOR
        : (options.palette[value] ?? options.palette.at(-1));
      if (!color || color === "transparent") {
        continue;
      }
      ctx.fillStyle = color;
      for (const repeat of repeats) {
        const x = (columnIndex + repeat - frame.offsetColumns) * stride;
        if (x + pixelSize < 0 || x > width) {
          continue;
        }
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }
};

/**
 * Phosphor bleed. One blurred self-composite in `lighter` mode costs a single
 * draw call, where a per-pixel `shadowBlur` would cost one blur per lit cell.
 */
const paintBloom = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: PaintOptions
): void => {
  if (options.bloomAlpha <= 0) {
    return;
  }
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = options.bloomAlpha;
  ctx.filter = `blur(${BLOOM_BLUR_PX}px)`;
  ctx.drawImage(canvas, 0, 0, options.width, options.height);
  ctx.restore();
};

/**
 * The unlit dot matrix behind the message. Drawn last with `destination-over`
 * so it never dulls a lit pixel, and phase-locked to the marquee offset so the
 * dots and the message always sit on the same sub-cell grid.
 */
const paintDotMatrix = (
  ctx: CanvasRenderingContext2D,
  options: PaintOptions
): void => {
  const { columnsInView, frame, pixelSize, stride } = options;
  const phase = frame.offsetColumns - Math.floor(frame.offsetColumns);
  ctx.save();
  ctx.globalCompositeOperation = "destination-over";
  ctx.globalAlpha = MATRIX_ALPHA;
  ctx.fillStyle = options.matrixColor;
  for (let rowIndex = 0; rowIndex < options.grid.length; rowIndex++) {
    const y = rowIndex * stride;
    for (let column = 0; column <= columnsInView; column++) {
      ctx.fillRect((column - phase) * stride, y, pixelSize, pixelSize);
    }
  }
  ctx.restore();
};

const paintFrame = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: PaintOptions
): void => {
  ctx.clearRect(0, 0, options.width, options.height);
  if (options.frame.visible) {
    paintLitPixels(ctx, options);
    paintBloom(ctx, canvas, options);
  }
  paintDotMatrix(ctx, options);
};

export type ArcadePixelAnimate = "none" | "type" | "wipe" | "blink" | "marquee";

export interface ArcadePixelProps {
  /** Reveal animation played on mount. `marquee` scrolls the message forever. */
  animate?: ArcadePixelAnimate;
  className?: string;
  /** Fixed display width in pixel cells. Defaults to the content width. */
  columns?: number;
  /** Curved vignette, chromatic fringing and a faint flicker over the canvas. */
  crt?: boolean;
  /** Gap, in CSS pixels, between pixel cells. */
  gap?: number;
  /** Phosphor bloom bleeding out of lit pixels. A number sets its intensity (0-1). */
  glow?: boolean | number;
  /** Whether the reveal animation repeats indefinitely. */
  loop?: boolean;
  /** Colors indexed by sprite/font value. Index 0 is treated as background. */
  palette?: string[];
  /** Size, in CSS pixels, of a single pixel cell. */
  pixelSize?: number;
  /** Overlays a CRT-style scanline pattern. */
  scanlines?: boolean;
  /** Animation speed multiplier. Higher plays faster. */
  speed?: number;
  /** 2D array of palette indices. Takes precedence over `text` when both are set. */
  sprite?: number[][];
  /** Text rendered through the built-in 5x7 pixel font. Ignored if `sprite` is set. */
  text?: string;
}

const DEFAULT_PIXEL_SIZE = 8;
const DEFAULT_GAP = 1;
const DEFAULT_PALETTE: string[] = ["transparent", "var(--color-brand)"];
const DEFAULT_SPEED = 1;
const MAX_DEVICE_PIXEL_RATIO = 2;
const TYPE_DURATION_MS = 1400;
const WIPE_DURATION_MS = 900;
const BLINK_INTERVAL_MS = 450;
const BLINK_SETTLE_CYCLES = 3;
const TYPE_FLASH_MS = 110;
const MARQUEE_COLUMNS_PER_SECOND = 16;
const MARQUEE_TAIL_COLUMNS = 8;
const DEFAULT_GLOW_INTENSITY = 0.65;
const MS_PER_SECOND = 1000;

/** Linear, expressed as a cubic-bezier so no string easing reaches Motion. */
const LINEAR_EASE: [number, number, number, number] = [0, 0, 1, 1];
const SCANLINE_PERIOD_PX = 3;
const SCANLINE_DRIFT_PX = SCANLINE_PERIOD_PX * 2;
const SCANLINE_DRIFT_SECONDS = 5;
const ROLL_BAND_SECONDS = 9;
const FLICKER_SECONDS = 2.4;

const SCANLINE_BACKGROUND = `repeating-linear-gradient(to bottom, rgba(0,0,0,0.44) 0px, rgba(0,0,0,0.44) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) ${SCANLINE_PERIOD_PX}px)`;
const ROLL_BAND_BACKGROUND =
  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0) 100%)";
const ABERRATION_BACKGROUND =
  "linear-gradient(90deg, rgba(255,0,72,0.18) 0%, rgba(255,0,72,0) 13%, rgba(0,190,255,0) 87%, rgba(0,190,255,0.18) 100%)";
const VIGNETTE_BACKGROUND =
  "radial-gradient(125% 125% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.32) 74%, rgba(0,0,0,0.82) 100%)";

type ArcadeCrtOverlayProps = {
  crt: boolean;
  scanlines: boolean;
  shouldReduceMotion: boolean;
};

/**
 * Every CRT artefact is a CSS layer stacked over the canvas, so none of it costs
 * per-frame canvas work.
 */
const ArcadeCrtOverlay = ({
  crt,
  scanlines,
  shouldReduceMotion,
}: ArcadeCrtOverlayProps) => (
  <>
    {scanlines ? (
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                transform: [
                  "translateY(0px)",
                  `translateY(-${SCANLINE_DRIFT_PX}px)`,
                ],
              }
        }
        className="absolute inset-x-0 top-0 h-[200%]"
        style={{ backgroundImage: SCANLINE_BACKGROUND }}
        transition={{
          duration: SCANLINE_DRIFT_SECONDS,
          ease: LINEAR_EASE,
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    ) : null}
    {crt ? (
      <>
        {shouldReduceMotion ? null : (
          <motion.div
            animate={{ transform: ["translateY(-140%)", "translateY(240%)"] }}
            className="absolute inset-x-0 top-0 h-1/3"
            style={{ backgroundImage: ROLL_BAND_BACKGROUND }}
            transition={{
              duration: ROLL_BAND_SECONDS,
              ease: LINEAR_EASE,
              repeat: Number.POSITIVE_INFINITY,
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: ABERRATION_BACKGROUND,
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: VIGNETTE_BACKGROUND,
            boxShadow: "inset 0 0 24px rgba(0,0,0,0.65)",
          }}
        />
        {shouldReduceMotion ? null : (
          <motion.div
            animate={{ opacity: [0.055, 0.015, 0.045, 0.01, 0.06] }}
            className="absolute inset-0 bg-white"
            transition={{
              duration: FLICKER_SECONDS,
              ease: LINEAR_EASE,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
            }}
          />
        )}
      </>
    ) : null}
  </>
);

const ArcadePixel = ({
  sprite,
  text,
  palette = DEFAULT_PALETTE,
  columns,
  pixelSize = DEFAULT_PIXEL_SIZE,
  gap = DEFAULT_GAP,
  scanlines = false,
  crt = false,
  glow = false,
  animate = "none",
  speed = DEFAULT_SPEED,
  loop = false,
  className,
}: ArcadePixelProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const grid = useMemo(() => resolveGrid(sprite, text), [sprite, text]);
  const paletteKey = palette.join(PALETTE_SEPARATOR);
  const stablePalette = useMemo(
    () => paletteKey.split(PALETTE_SEPARATOR),
    [paletteKey]
  );

  const totalRows = grid.length;
  const totalColumns = grid[0]?.length ?? 0;
  const columnsInView = Math.max(1, columns ?? totalColumns);
  const stride = pixelSize + gap;
  const cssWidth = columnsInView * stride - gap;
  const cssHeight = totalRows * stride - gap;

  const { numUnits, unitWidth } = useMemo(() => {
    if (!sprite && typeof text === "string") {
      return {
        numUnits: Math.max(1, Array.from(text).length),
        unitWidth: CHARACTER_UNIT_WIDTH,
      };
    }
    return { numUnits: Math.max(1, totalColumns), unitWidth: 1 };
  }, [sprite, text, totalColumns]);

  const accessibleLabel =
    typeof text === "string" && text.trim().length > 0 ? text : "pixel art";

  const glowIntensity =
    typeof glow === "number" ? glow : (glow && DEFAULT_GLOW_INTENSITY) || 0;

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!(container && canvas && ctx)) {
      return;
    }

    const safeSpeed = speed > 0 ? speed : DEFAULT_SPEED;
    const isStatic = shouldReduceMotion || animate === "none";
    const resolvedPalette = stablePalette.map((color) =>
      color === "transparent" ? color : resolveColor(container, color)
    );
    const matrixColor =
      resolvedPalette.find((color) => color !== "transparent") ??
      FALLBACK_COLOR;
    const period =
      animate === "marquee" ? totalColumns + MARQUEE_TAIL_COLUMNS : 0;

    const staticFrame: FrameState = {
      done: true,
      flashEnd: -1,
      flashStart: -1,
      offsetColumns: 0,
      revealedColumns: totalColumns,
      visible: true,
    };

    let rafId: number | null = null;
    let isFinished = isStatic;
    let isOffscreen = false;
    let isHidden = document.hidden;
    let isPaused = false;
    let elapsedMs = 0;
    let lastTimestamp: number | null = null;
    let lastFrame: FrameState = staticFrame;
    let currentCssWidth = cssWidth;
    let currentCssHeight = cssHeight;
    let landedUnits = 0;
    let flashStartedAtMs = Number.NEGATIVE_INFINITY;

    const setBackingStoreSize = () => {
      const rect = container.getBoundingClientRect();
      currentCssWidth = rect.width;
      currentCssHeight = rect.height;
      const devicePixelRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_DEVICE_PIXEL_RATIO
      );
      const width = Math.max(1, Math.round(rect.width * devicePixelRatio));
      const height = Math.max(1, Math.round(rect.height * devicePixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const render = (frame: FrameState) => {
      lastFrame = frame;
      paintFrame(ctx, canvas, {
        bloomAlpha: glowIntensity,
        columnsInView,
        frame,
        grid,
        height: currentCssHeight,
        matrixColor,
        palette: resolvedPalette,
        period,
        pixelSize,
        stride,
        width: currentCssWidth,
      });
    };

    const computeTypeFrame = (): FrameState => {
      const progress = Math.min(elapsedMs / (TYPE_DURATION_MS / safeSpeed), 1);
      const units = Math.floor(progress * numUnits);
      if (units !== landedUnits) {
        landedUnits = units;
        flashStartedAtMs = elapsedMs;
      }
      const isFlashing = elapsedMs - flashStartedAtMs < TYPE_FLASH_MS;
      return {
        done: progress >= 1,
        flashEnd: isFlashing ? units * unitWidth : -1,
        flashStart: isFlashing ? (units - 1) * unitWidth : -1,
        offsetColumns: 0,
        revealedColumns: Math.min(totalColumns, units * unitWidth),
        visible: true,
      };
    };

    const computeWipeFrame = (): FrameState => {
      const progress = Math.min(elapsedMs / (WIPE_DURATION_MS / safeSpeed), 1);
      return {
        ...staticFrame,
        done: progress >= 1,
        revealedColumns: Math.floor(progress * totalColumns),
      };
    };

    const computeBlinkFrame = (): FrameState => {
      const phase = Math.floor(elapsedMs / (BLINK_INTERVAL_MS / safeSpeed));
      const settled = !loop && phase >= BLINK_SETTLE_CYCLES * 2;
      return {
        ...staticFrame,
        done: settled,
        visible: settled || phase % 2 === 0,
      };
    };

    const computeMarqueeFrame = (): FrameState => {
      const columnsPerMs =
        (MARQUEE_COLUMNS_PER_SECOND * safeSpeed) / MS_PER_SECOND;
      return {
        ...staticFrame,
        done: false,
        offsetColumns: (elapsedMs * columnsPerMs) % Math.max(1, period),
      };
    };

    const computeFrame = (): FrameState => {
      if (animate === "type") {
        return computeTypeFrame();
      }
      if (animate === "wipe") {
        return computeWipeFrame();
      }
      if (animate === "blink") {
        return computeBlinkFrame();
      }
      if (animate === "marquee") {
        return computeMarqueeFrame();
      }
      return staticFrame;
    };

    const step = (timestamp: number) => {
      rafId = null;
      if (isPaused || isFinished) {
        return;
      }
      if (lastTimestamp !== null) {
        elapsedMs += timestamp - lastTimestamp;
      }
      lastTimestamp = timestamp;

      const frame = computeFrame();
      // A blinking display only changes twice a second, so repainting it every
      // rAF tick would be pure waste.
      if (!isSameFrame(frame, lastFrame)) {
        render(frame);
      }

      if (frame.done) {
        if (loop) {
          elapsedMs = 0;
          landedUnits = 0;
          flashStartedAtMs = Number.NEGATIVE_INFINITY;
        } else {
          render(staticFrame);
          isFinished = true;
          return;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    const schedule = () => {
      if (isPaused || isFinished || rafId !== null) {
        return;
      }
      rafId = requestAnimationFrame(step);
    };

    const updatePauseState = () => {
      const shouldPause = isOffscreen || isHidden;
      if (shouldPause === isPaused) {
        return;
      }
      isPaused = shouldPause;
      if (isPaused) {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        lastTimestamp = null;
      } else {
        schedule();
      }
    };

    setBackingStoreSize();
    if (isFinished) {
      render(staticFrame);
    } else {
      render({ ...staticFrame, revealedColumns: 0 });
      schedule();
    }

    const resizeObserver = new ResizeObserver(() => {
      setBackingStoreSize();
      render(lastFrame);
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (!entry) {
        return;
      }
      isOffscreen = !entry.isIntersecting;
      updatePauseState();
    });
    intersectionObserver.observe(container);

    const handleVisibilityChange = () => {
      isHidden = document.hidden;
      updatePauseState();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    grid,
    stablePalette,
    pixelSize,
    stride,
    columnsInView,
    glowIntensity,
    animate,
    speed,
    loop,
    shouldReduceMotion,
    totalColumns,
    numUnits,
    unitWidth,
    cssWidth,
    cssHeight,
  ]);

  return (
    <div
      className={cn("relative inline-block overflow-hidden", className)}
      ref={containerRef}
      style={{ height: cssHeight, width: cssWidth }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
      >
        <canvas className="block h-full w-full" ref={canvasRef} />
        <ArcadeCrtOverlay
          crt={crt}
          scanlines={scanlines}
          shouldReduceMotion={shouldReduceMotion}
        />
      </div>
      <span className="sr-only">{accessibleLabel}</span>
    </div>
  );
};

export default ArcadePixel;
