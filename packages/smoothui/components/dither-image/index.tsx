"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

export type DitherAlgorithm =
  | "bayer"
  | "atkinson"
  | "floyd-steinberg"
  | "threshold";

export interface DitherImageProps {
  /** Dithering kernel used to quantise the image. */
  algorithm?: DitherAlgorithm;
  /** Alternative text. Always required — it is the accessible name of the result. */
  alt: string;
  /** Extra classes for the wrapper. */
  className?: string;
  /** Rendered height in CSS pixels. */
  height?: number;
  /** Number of tones in the ramp, clamped to `2`–`8`. */
  levels?: number;
  /** Colour ramp, dark to light. Defaults to a monochrome ramp from the theme. */
  palette?: string[];
  /** Size of one dithered block in CSS pixels. */
  pixelSize?: number;
  /** Wipe the dithered pass in when the image scrolls into view. */
  progressive?: boolean;
  /** Image URL. Must allow cross-origin reads to be dithered. */
  src: string;
  /** Rendered width in CSS pixels. */
  width?: number;
}

type Rgb = [number, number, number];
type RenderStatus = "fallback" | "loading" | "ready";

const DEFAULT_WIDTH = 480;
const DEFAULT_HEIGHT = 320;
const DEFAULT_PIXEL_SIZE = 4;
const DEFAULT_LEVELS = 2;
const MIN_LEVELS = 2;
const MAX_LEVELS = 8;
const MIN_PIXEL_SIZE = 1;
const MAX_DPR = 2;
const CHANNELS = 4;
const MAX_CHANNEL = 255;
const BAYER_SIZE = 8;
const BAYER_DIVISOR = BAYER_SIZE * BAYER_SIZE;
const LUMA_R = 0.2126;
const LUMA_G = 0.7152;
const LUMA_B = 0.0722;
const REVEAL_DURATION_S = 0.6;
const REVEAL_EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];
const REVEAL_MARGIN = "0px 0px -10% 0px";
const HIDDEN_CLIP = "inset(0% 0% 100% 0%)";
const VISIBLE_CLIP = "inset(0% 0% 0% 0%)";
const FALLBACK_DARK = "black";
const FALLBACK_LIGHT = "white";

const BAYER_MATRIX = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
];

const FLOYD_STEINBERG_KERNEL = [
  { dx: 1, dy: 0, weight: 7 / 16 },
  { dx: -1, dy: 1, weight: 3 / 16 },
  { dx: 0, dy: 1, weight: 5 / 16 },
  { dx: 1, dy: 1, weight: 1 / 16 },
];

const ATKINSON_WEIGHT = 1 / 8;
const ATKINSON_KERNEL = [
  { dx: 1, dy: 0, weight: ATKINSON_WEIGHT },
  { dx: 2, dy: 0, weight: ATKINSON_WEIGHT },
  { dx: -1, dy: 1, weight: ATKINSON_WEIGHT },
  { dx: 0, dy: 1, weight: ATKINSON_WEIGHT },
  { dx: 1, dy: 1, weight: ATKINSON_WEIGHT },
  { dx: 0, dy: 2, weight: ATKINSON_WEIGHT },
];

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const luminanceOf = ([r, g, b]: Rgb) =>
  (r * LUMA_R + g * LUMA_G + b * LUMA_B) / MAX_CHANNEL;

const readCssColor = (
  scratch: CanvasRenderingContext2D,
  value: string
): Rgb => {
  scratch.clearRect(0, 0, 1, 1);
  scratch.fillStyle = value;
  scratch.fillRect(0, 0, 1, 1);
  const { data } = scratch.getImageData(0, 0, 1, 1);
  return [data[0], data[1], data[2]];
};

const readThemeStops = (
  scratch: CanvasRenderingContext2D,
  element: HTMLElement
): Rgb[] => {
  const styles = getComputedStyle(element);
  const foreground =
    styles.getPropertyValue("--color-foreground").trim() || FALLBACK_DARK;
  const background =
    styles.getPropertyValue("--color-background").trim() || FALLBACK_LIGHT;
  const first = readCssColor(scratch, foreground);
  const second = readCssColor(scratch, background);
  return luminanceOf(first) <= luminanceOf(second)
    ? [first, second]
    : [second, first];
};

const buildRamp = (stops: Rgb[], levels: number): Rgb[] => {
  if (stops.length === 1) {
    return Array.from({ length: levels }, () => stops[0]);
  }
  const lastStop = stops.length - 1;
  const lastLevel = levels - 1;
  return Array.from({ length: levels }, (_unused, index) => {
    const position = (index / lastLevel) * lastStop;
    const lower = Math.floor(position);
    const upper = Math.min(lastStop, lower + 1);
    const mix = position - lower;
    const from = stops[lower];
    const to = stops[upper];
    return [
      Math.round(from[0] + (to[0] - from[0]) * mix),
      Math.round(from[1] + (to[1] - from[1]) * mix),
      Math.round(from[2] + (to[2] - from[2]) * mix),
    ] as Rgb;
  });
};

const readLuminance = (data: Uint8ClampedArray) => {
  const values = new Float32Array(data.length / CHANNELS);
  for (let index = 0; index < values.length; index++) {
    const offset = index * CHANNELS;
    values[index] =
      (data[offset] * LUMA_R +
        data[offset + 1] * LUMA_G +
        data[offset + 2] * LUMA_B) /
      MAX_CHANNEL;
  }
  return values;
};

const diffuse = (
  values: Float32Array,
  gridWidth: number,
  gridHeight: number,
  levels: number,
  kernel: { dx: number; dy: number; weight: number }[]
) => {
  const steps = levels - 1;
  const quantised = new Uint8Array(values.length);
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const index = y * gridWidth + x;
      const original = values[index];
      const level = clamp(Math.round(original * steps), 0, steps);
      quantised[index] = level;
      const error = original - level / steps;
      for (const tap of kernel) {
        const nx = x + tap.dx;
        const ny = y + tap.dy;
        if (nx < 0 || nx >= gridWidth || ny >= gridHeight) {
          continue;
        }
        values[ny * gridWidth + nx] += error * tap.weight;
      }
    }
  }
  return quantised;
};

const quantiseOrdered = (
  values: Float32Array,
  gridWidth: number,
  levels: number,
  ordered: boolean
) => {
  const steps = levels - 1;
  const quantised = new Uint8Array(values.length);
  for (let index = 0; index < values.length; index++) {
    let value = values[index];
    if (ordered) {
      const x = index % gridWidth;
      const y = Math.floor(index / gridWidth);
      const cell =
        BAYER_MATRIX[(y % BAYER_SIZE) * BAYER_SIZE + (x % BAYER_SIZE)];
      value += ((cell + 0.5) / BAYER_DIVISOR - 0.5) / steps;
    }
    quantised[index] = clamp(Math.round(value * steps), 0, steps);
  }
  return quantised;
};

const applyRamp = (
  data: Uint8ClampedArray,
  quantised: Uint8Array,
  ramp: Rgb[]
) => {
  for (let index = 0; index < quantised.length; index++) {
    const offset = index * CHANNELS;
    const tone = ramp[quantised[index]];
    data[offset] = tone[0];
    data[offset + 1] = tone[1];
    data[offset + 2] = tone[2];
  }
};

const DitherImage = ({
  algorithm = "bayer",
  alt,
  className,
  height = DEFAULT_HEIGHT,
  levels = DEFAULT_LEVELS,
  palette,
  pixelSize = DEFAULT_PIXEL_SIZE,
  progressive = false,
  src,
  width = DEFAULT_WIDTH,
}: DitherImageProps) => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<RenderStatus>("loading");
  const [isRevealed, setIsRevealed] = useState(false);

  const paletteKey = palette?.join("|") ?? "";
  const resolvedPalette = useMemo(
    () => (paletteKey ? paletteKey.split("|") : undefined),
    [paletteKey]
  );

  const safeLevels = clamp(Math.round(levels), MIN_LEVELS, MAX_LEVELS);
  const safePixelSize = Math.max(MIN_PIXEL_SIZE, Math.round(pixelSize));

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!(canvas && container)) {
      return;
    }

    const context = canvas.getContext("2d", { willReadFrequently: true });
    const scratchCanvas = document.createElement("canvas");
    scratchCanvas.width = 1;
    scratchCanvas.height = 1;
    const scratch = scratchCanvas.getContext("2d", {
      willReadFrequently: true,
    });
    const grid = document.createElement("canvas");
    const gridContext = grid.getContext("2d", { willReadFrequently: true });

    if (!(context && scratch && gridContext)) {
      setStatus("fallback");
      return;
    }

    let isCancelled = false;
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";

    const render = () => {
      const gridWidth = Math.max(1, Math.round(width / safePixelSize));
      const gridHeight = Math.max(1, Math.round(height / safePixelSize));
      grid.width = gridWidth;
      grid.height = gridHeight;
      gridContext.clearRect(0, 0, gridWidth, gridHeight);
      gridContext.drawImage(image, 0, 0, gridWidth, gridHeight);

      const frame = gridContext.getImageData(0, 0, gridWidth, gridHeight);
      const values = readLuminance(frame.data);
      let quantised: Uint8Array;
      if (algorithm === "floyd-steinberg") {
        quantised = diffuse(
          values,
          gridWidth,
          gridHeight,
          safeLevels,
          FLOYD_STEINBERG_KERNEL
        );
      } else if (algorithm === "atkinson") {
        quantised = diffuse(
          values,
          gridWidth,
          gridHeight,
          safeLevels,
          ATKINSON_KERNEL
        );
      } else {
        quantised = quantiseOrdered(
          values,
          gridWidth,
          safeLevels,
          algorithm === "bayer"
        );
      }

      const stops = resolvedPalette
        ? resolvedPalette.map((entry) => readCssColor(scratch, entry))
        : readThemeStops(scratch, container);
      applyRamp(frame.data, quantised, buildRamp(stops, safeLevels));
      gridContext.putImageData(frame, 0, 0);

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.imageSmoothingEnabled = false;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(grid, 0, 0, canvas.width, canvas.height);
      setStatus("ready");
    };

    image.onload = () => {
      if (isCancelled) {
        return;
      }
      try {
        render();
      } catch {
        setStatus("fallback");
      }
    };
    image.onerror = () => {
      if (!isCancelled) {
        setStatus("fallback");
      }
    };
    image.src = src;

    return () => {
      isCancelled = true;
      image.onload = null;
      image.onerror = null;
      image.src = "";
      context.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
      grid.width = 0;
      grid.height = 0;
      scratchCanvas.width = 0;
      scratchCanvas.height = 0;
    };
  }, [
    algorithm,
    height,
    resolvedPalette,
    safeLevels,
    safePixelSize,
    src,
    width,
  ]);

  useEffect(() => {
    const container = containerRef.current;
    if (!progressive || shouldReduceMotion) {
      setIsRevealed(true);
      return;
    }
    if (!(container && typeof IntersectionObserver !== "undefined")) {
      setIsRevealed(true);
      return;
    }
    setIsRevealed(false);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: REVEAL_MARGIN }
    );
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [progressive, shouldReduceMotion]);

  const isDithered = status === "ready";
  const animatesReveal = progressive && !shouldReduceMotion;

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-xl bg-background",
        className
      )}
      ref={containerRef}
      style={{ height, width }}
    >
      <img
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        height={height}
        src={src}
        width={width}
      />
      <motion.canvas
        animate={{
          clipPath: animatesReveal && !isRevealed ? HIDDEN_CLIP : VISIBLE_CLIP,
          opacity: isDithered ? 1 : 0,
        }}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        initial={false}
        ref={canvasRef}
        style={{ imageRendering: "pixelated" }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: REVEAL_DURATION_S, ease: REVEAL_EASE }
        }
      />
    </div>
  );
};

export default DitherImage;
