"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";

/* -------------------------------------------------------------------------- */
/* Public types                                                               */
/* -------------------------------------------------------------------------- */

export const DITHER_CHART_VARIANTS = [
  "donut",
  "line",
  "bar",
  "stacked",
  "gauge",
  "funnel",
  "heatmap",
  "bubbles",
] as const;

export type DitherChartVariant = (typeof DITHER_CHART_VARIANTS)[number];

/** Bayer matrix order used to quantise every fill into a dot pattern. */
export type DitherChartMatrixOrder = 2 | 4 | 8;

export interface DitherChartPoint {
  /** Optional label, used only by the screen-reader text alternative. */
  label?: string;
  /** Numeric value of the point. */
  value: number;
}

export interface DitherChartSeries {
  /** Overrides the palette colour for this series. */
  color?: string;
  /** Series name, used only by the screen-reader text alternative. */
  name?: string;
  /** Ordered data points of the series. */
  points: DitherChartPoint[];
}

export interface DitherChartProps {
  /** Draw the chart in on mount / when it scrolls into view. */
  animate?: boolean;
  /** Caption rendered under the chart. */
  caption?: string;
  className?: string;
  /**
   * Chart data. Every variant reads the same shape:
   * `donut`, `gauge`, `funnel` use the first series, `heatmap` maps one series
   * per row, the rest render every series.
   */
  data: DitherChartSeries[];
  /** CSS height in pixels. */
  height?: number;
  /** Accessible title rendered above the chart. */
  label?: string;
  /** Bayer matrix order. Larger matrices produce finer gradients. */
  matrix?: DitherChartMatrixOrder;
  /** Colours cycled per series (or per slice for `donut`). */
  palette?: string[];
  /** Size in CSS pixels of one dithered pixel. */
  pixelSize?: number;
  variant?: DitherChartVariant;
  /** CSS width in pixels. */
  width?: number;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 180;
const DEFAULT_PIXEL_SIZE = 3;
const DEFAULT_MATRIX: DitherChartMatrixOrder = 4;
const DEFAULT_VARIANT: DitherChartVariant = "line";

const DRAW_IN_DURATION_MS = 900;
const BEZIER_ITERATIONS = 16;
const EASE_OUT_X1 = 0.23;
const EASE_OUT_Y1 = 1;
const EASE_OUT_X2 = 0.32;
const EASE_OUT_Y2 = 1;

const ALPHA_MAX = 255;
const RGBA_STRIDE = 4;
const ALPHA_OFFSET = 3;
const QUADRANT_OFFSETS = [
  [0, 2],
  [3, 1],
];

/** Alpha ramp that gives each series a distinct dither density. */
const TONE_RAMP = [1, 0.68, 0.46, 0.3, 0.2];
const AREA_TONE_FACTOR = 0.45;
const TRACK_TONE = 0.16;
const HEATMAP_MIN_TONE = 0.08;

const EDGE_INSET = 1;
const LINE_WIDTH = 1;
const BAR_FILL_RATIO = 0.72;
const FUNNEL_ROW_GAP = 1;
const DONUT_INNER_RATIO = 0.55;
const GAUGE_INNER_RATIO = 0.62;
const GAUGE_START_ANGLE = Math.PI * 0.75;
const GAUGE_SWEEP = Math.PI * 1.5;
const GAUGE_MAX_VALUE = 100;
const BUBBLE_MIN_RADIUS = 1;
const BUBBLE_MAX_RATIO = 0.16;
const FULL_TURN = Math.PI * 2;
const QUARTER_TURN = Math.PI / 2;
const HALF = 0.5;
const MIN_DIMENSION = 1;

/* -------------------------------------------------------------------------- */
/* Bayer matrices                                                             */
/* -------------------------------------------------------------------------- */

const buildBayer = (order: number): number[][] => {
  if (order <= 1) {
    return [[0]];
  }
  const half = buildBayer(order / 2);
  const halfSize = half.length;
  const matrix: number[][] = [];
  for (let y = 0; y < order; y++) {
    const row: number[] = [];
    for (let x = 0; x < order; x++) {
      const quadrantY = y < halfSize ? 0 : 1;
      const quadrantX = x < halfSize ? 0 : 1;
      row.push(
        half[y % halfSize][x % halfSize] * QUADRANT_OFFSETS.length ** 2 +
          QUADRANT_OFFSETS[quadrantY][quadrantX]
      );
    }
    matrix.push(row);
  }
  return matrix;
};

const BAYER_MATRICES: Record<DitherChartMatrixOrder, number[][]> = {
  2: buildBayer(2),
  4: buildBayer(4),
  8: buildBayer(8),
};

/* -------------------------------------------------------------------------- */
/* Easing                                                                     */
/* -------------------------------------------------------------------------- */

const bezierAxis = (t: number, a: number, b: number): number => {
  const inverse = 1 - t;
  return 3 * inverse * inverse * t * a + 3 * inverse * t * t * b + t * t * t;
};

/** Solves `cubic-bezier(.23, 1, .32, 1)` for a linear progress value. */
const easeOut = (progress: number): number => {
  let low = 0;
  let high = 1;
  let t = progress;
  for (let i = 0; i < BEZIER_ITERATIONS; i++) {
    if (bezierAxis(t, EASE_OUT_X1, EASE_OUT_X2) < progress) {
      low = t;
    } else {
      high = t;
    }
    t = (low + high) * HALF;
  }
  return bezierAxis(t, EASE_OUT_Y1, EASE_OUT_Y2);
};

/* -------------------------------------------------------------------------- */
/* Drawing helpers                                                            */
/* -------------------------------------------------------------------------- */

interface DrawContext {
  colorAt: (index: number) => string;
  ctx: CanvasRenderingContext2D;
  height: number;
  progress: number;
  series: DitherChartSeries[];
  toneAt: (index: number) => number;
  width: number;
}

const seriesMax = (series: DitherChartSeries[]): number => {
  let max = 0;
  for (const item of series) {
    for (const point of item.points) {
      if (point.value > max) {
        max = point.value;
      }
    }
  }
  return max || 1;
};

const maxPointCount = (series: DitherChartSeries[]): number => {
  let count = 0;
  for (const item of series) {
    if (item.points.length > count) {
      count = item.points.length;
    }
  }
  return count || 1;
};

const sumPoints = (points: DitherChartPoint[]): number => {
  let total = 0;
  for (const point of points) {
    total += point.value;
  }
  return total || 1;
};

const ringSegment = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outer: number,
  inner: number,
  start: number,
  end: number
) => {
  ctx.beginPath();
  ctx.arc(cx, cy, outer, start, end);
  ctx.arc(cx, cy, inner, end, start, true);
  ctx.closePath();
  ctx.fill();
};

const drawLine = ({
  colorAt,
  ctx,
  height,
  progress,
  series,
  toneAt,
  width,
}: DrawContext) => {
  const max = seriesMax(series);
  const baseline = height - EDGE_INSET;
  const usable = baseline - EDGE_INSET;
  for (let i = 0; i < series.length; i++) {
    const { points } = series[i];
    if (points.length < 2) {
      continue;
    }
    const step = (width - EDGE_INSET * 2) / (points.length - 1);
    const coords = points.map((point, index) => ({
      x: EDGE_INSET + step * index,
      y: baseline - (point.value / max) * usable * progress,
    }));
    const color = series[i].color ?? colorAt(i);
    const lastX = EDGE_INSET + step * (points.length - 1);

    ctx.fillStyle = color;
    ctx.globalAlpha = toneAt(i) * AREA_TONE_FACTOR;
    ctx.beginPath();
    ctx.moveTo(coords[0].x, baseline);
    for (const coord of coords) {
      ctx.lineTo(coord.x, coord.y);
    }
    ctx.lineTo(lastX, baseline);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = color;
    ctx.globalAlpha = toneAt(i);
    ctx.lineWidth = LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (const coord of coords) {
      ctx.lineTo(coord.x, coord.y);
    }
    ctx.stroke();
  }
};

const drawBar = ({
  colorAt,
  ctx,
  height,
  progress,
  series,
  toneAt,
  width,
}: DrawContext) => {
  const max = seriesMax(series);
  const groups = maxPointCount(series);
  const baseline = height - EDGE_INSET;
  const usable = baseline - EDGE_INSET;
  const slot = (width - EDGE_INSET * 2) / groups;
  const barWidth = Math.max(
    MIN_DIMENSION,
    (slot * BAR_FILL_RATIO) / series.length
  );
  const groupWidth = barWidth * series.length;

  for (let group = 0; group < groups; group++) {
    const slotStart = EDGE_INSET + slot * group + (slot - groupWidth) * HALF;
    for (let i = 0; i < series.length; i++) {
      const value = series[i].points[group]?.value ?? 0;
      const barHeight = (value / max) * usable * progress;
      ctx.fillStyle = series[i].color ?? colorAt(i);
      ctx.globalAlpha = toneAt(i);
      ctx.fillRect(
        slotStart + barWidth * i,
        baseline - barHeight,
        barWidth,
        barHeight
      );
    }
  }
};

const drawStacked = ({
  colorAt,
  ctx,
  height,
  progress,
  series,
  toneAt,
  width,
}: DrawContext) => {
  const groups = maxPointCount(series);
  let maxTotal = 1;
  for (let group = 0; group < groups; group++) {
    let total = 0;
    for (const item of series) {
      total += item.points[group]?.value ?? 0;
    }
    if (total > maxTotal) {
      maxTotal = total;
    }
  }

  const baseline = height - EDGE_INSET;
  const usable = baseline - EDGE_INSET;
  const slot = (width - EDGE_INSET * 2) / groups;
  const barWidth = Math.max(MIN_DIMENSION, slot * BAR_FILL_RATIO);

  for (let group = 0; group < groups; group++) {
    const x = EDGE_INSET + slot * group + (slot - barWidth) * HALF;
    let stacked = 0;
    for (let i = 0; i < series.length; i++) {
      const value = series[i].points[group]?.value ?? 0;
      const segment = (value / maxTotal) * usable * progress;
      ctx.fillStyle = series[i].color ?? colorAt(i);
      ctx.globalAlpha = toneAt(i);
      ctx.fillRect(x, baseline - stacked - segment, barWidth, segment);
      stacked += segment;
    }
  }
};

const drawDonut = ({
  colorAt,
  ctx,
  height,
  progress,
  series,
  toneAt,
  width,
}: DrawContext) => {
  const points = series[0]?.points ?? [];
  if (points.length === 0) {
    return;
  }
  const total = sumPoints(points);
  const cx = width * HALF;
  const cy = height * HALF;
  const outer = Math.min(width, height) * HALF - EDGE_INSET;
  const inner = outer * DONUT_INNER_RATIO;
  let angle = -QUARTER_TURN;

  for (let i = 0; i < points.length; i++) {
    const sweep = (points[i].value / total) * FULL_TURN * progress;
    ctx.fillStyle = colorAt(i);
    ctx.globalAlpha = toneAt(i);
    ringSegment(ctx, cx, cy, outer, inner, angle, angle + sweep);
    angle += sweep;
  }
};

const drawGauge = ({
  colorAt,
  ctx,
  height,
  progress,
  series,
  toneAt,
  width,
}: DrawContext) => {
  const value = series[0]?.points[0]?.value ?? 0;
  const ratio = Math.min(1, Math.max(0, value / GAUGE_MAX_VALUE));
  const cx = width * HALF;
  const cy = height * HALF;
  const outer = Math.min(width, height) * HALF - EDGE_INSET;
  const inner = outer * GAUGE_INNER_RATIO;

  ctx.fillStyle = colorAt(0);
  ctx.globalAlpha = TRACK_TONE;
  ringSegment(
    ctx,
    cx,
    cy,
    outer,
    inner,
    GAUGE_START_ANGLE,
    GAUGE_START_ANGLE + GAUGE_SWEEP
  );

  ctx.globalAlpha = toneAt(0);
  ringSegment(
    ctx,
    cx,
    cy,
    outer,
    inner,
    GAUGE_START_ANGLE,
    GAUGE_START_ANGLE + GAUGE_SWEEP * ratio * progress
  );
};

const drawFunnel = ({
  colorAt,
  ctx,
  height,
  progress,
  series,
  toneAt,
  width,
}: DrawContext) => {
  const points = series[0]?.points ?? [];
  if (points.length === 0) {
    return;
  }
  const max = seriesMax(series);
  const rowHeight = (height - EDGE_INSET * 2) / points.length;
  const usable = width - EDGE_INSET * 2;

  for (let i = 0; i < points.length; i++) {
    const rowWidth = (points[i].value / max) * usable * progress;
    ctx.fillStyle = colorAt(i);
    ctx.globalAlpha = toneAt(i);
    ctx.fillRect(
      (width - rowWidth) * HALF,
      EDGE_INSET + rowHeight * i,
      rowWidth,
      Math.max(MIN_DIMENSION, rowHeight - FUNNEL_ROW_GAP)
    );
  }
};

const drawHeatmap = ({
  colorAt,
  ctx,
  height,
  progress,
  series,
  width,
}: DrawContext) => {
  const max = seriesMax(series);
  const columns = maxPointCount(series);
  const cellWidth = (width - EDGE_INSET * 2) / columns;
  const cellHeight = (height - EDGE_INSET * 2) / series.length;
  ctx.fillStyle = colorAt(0);

  for (let row = 0; row < series.length; row++) {
    for (let column = 0; column < columns; column++) {
      const value = series[row].points[column]?.value ?? 0;
      const intensity =
        HEATMAP_MIN_TONE + (value / max) * (1 - HEATMAP_MIN_TONE);
      ctx.globalAlpha = intensity * progress;
      ctx.fillRect(
        EDGE_INSET + cellWidth * column,
        EDGE_INSET + cellHeight * row,
        cellWidth,
        cellHeight
      );
    }
  }
};

const drawBubbles = ({
  colorAt,
  ctx,
  height,
  progress,
  series,
  toneAt,
  width,
}: DrawContext) => {
  const max = seriesMax(series);
  const columns = maxPointCount(series);
  const baseline = height - EDGE_INSET;
  const usable = baseline - EDGE_INSET;
  const step = (width - EDGE_INSET * 2) / columns;
  const maxRadius = Math.min(width, height) * BUBBLE_MAX_RATIO;

  for (let i = 0; i < series.length; i++) {
    ctx.fillStyle = series[i].color ?? colorAt(i);
    ctx.globalAlpha = toneAt(i);
    const { points } = series[i];
    for (let j = 0; j < points.length; j++) {
      const ratio = points[j].value / max;
      const radius =
        (BUBBLE_MIN_RADIUS + ratio * (maxRadius - BUBBLE_MIN_RADIUS)) *
        progress;
      if (radius <= 0) {
        continue;
      }
      ctx.beginPath();
      ctx.arc(
        EDGE_INSET + step * (j + HALF),
        baseline - ratio * usable,
        radius,
        0,
        FULL_TURN
      );
      ctx.fill();
    }
  }
};

const VARIANT_PAINTERS: Record<
  DitherChartVariant,
  (context: DrawContext) => void
> = {
  bar: drawBar,
  bubbles: drawBubbles,
  donut: drawDonut,
  funnel: drawFunnel,
  gauge: drawGauge,
  heatmap: drawHeatmap,
  line: drawLine,
  stacked: drawStacked,
};

/** Quantises every pixel's alpha through the Bayer matrix. */
const applyDither = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  order: DitherChartMatrixOrder
) => {
  const image = ctx.getImageData(0, 0, width, height);
  const pixels = image.data;
  const matrix = BAYER_MATRICES[order];
  const levels = order * order;

  for (let y = 0; y < height; y++) {
    const row = matrix[y % order];
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * RGBA_STRIDE + ALPHA_OFFSET;
      const coverage = pixels[index] / ALPHA_MAX;
      const threshold = (row[x % order] + HALF) / levels;
      pixels[index] = coverage > threshold ? ALPHA_MAX : 0;
    }
  }

  ctx.putImageData(image, 0, 0);
};

const resolvePalette = (element: HTMLElement, palette?: string[]): string[] => {
  if (palette && palette.length > 0) {
    return palette;
  }
  const styles = getComputedStyle(element);
  const current = styles.color || "#000000";
  const brand = styles.getPropertyValue("--color-brand").trim();
  return brand ? [brand, current] : [current];
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const DitherChart = ({
  animate = true,
  caption,
  className,
  data,
  height = DEFAULT_HEIGHT,
  label,
  matrix = DEFAULT_MATRIX,
  palette,
  pixelSize = DEFAULT_PIXEL_SIZE,
  variant = DEFAULT_VARIANT,
  width = DEFAULT_WIDTH,
}: DitherChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bufferRef = useRef<HTMLCanvasElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const draw = useCallback(
    (progress: number) => {
      const canvas = canvasRef.current;
      if (!canvas || data.length === 0) {
        return;
      }

      const buffer = bufferRef.current ?? document.createElement("canvas");
      bufferRef.current = buffer;

      const lowWidth = Math.max(MIN_DIMENSION, Math.round(width / pixelSize));
      const lowHeight = Math.max(MIN_DIMENSION, Math.round(height / pixelSize));
      buffer.width = lowWidth;
      buffer.height = lowHeight;

      const bufferCtx = buffer.getContext("2d", { willReadFrequently: true });
      if (!bufferCtx) {
        return;
      }
      bufferCtx.clearRect(0, 0, lowWidth, lowHeight);
      bufferCtx.globalAlpha = 1;

      const colors = resolvePalette(canvas, palette);
      const painter = VARIANT_PAINTERS[variant];
      painter({
        colorAt: (index: number) => colors[index % colors.length],
        ctx: bufferCtx,
        height: lowHeight,
        progress,
        series: data,
        toneAt: (index: number) => TONE_RAMP[index % TONE_RAMP.length],
        width: lowWidth,
      });
      bufferCtx.globalAlpha = 1;
      applyDither(bufferCtx, lowWidth, lowHeight, matrix);

      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        buffer,
        0,
        0,
        lowWidth,
        lowHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );
    },
    [data, height, matrix, palette, pixelSize, variant, width]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    if (!animate || shouldReduceMotion) {
      draw(1);
      return;
    }

    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let running = false;
    draw(0);

    const tick = (time: number) => {
      if (last === 0) {
        last = time;
      }
      elapsed += time - last;
      last = time;
      const progress = Math.min(1, elapsed / DRAW_IN_DURATION_MS);
      draw(easeOut(progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || elapsed >= DRAW_IN_DURATION_MS) {
        return;
      }
      running = true;
      last = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) {
        return;
      }
      cancelAnimationFrame(frame);
      running = false;
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      }
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [animate, draw, shouldReduceMotion]);

  const description = useMemo(() => {
    const summaries = data.map((item, index) => {
      const name = item.name ?? `Series ${index + 1}`;
      const values = item.points
        .map(
          (point, pointIndex) =>
            `${point.label ?? `Point ${pointIndex + 1}`}: ${point.value}`
        )
        .join(", ");
      return `${name} — ${values}`;
    });
    return `${label ?? "Dithered chart"}, ${variant} variant. ${summaries.join(". ")}.`;
  }, [data, label, variant]);

  return (
    <figure
      className={cn("inline-flex flex-col gap-2 text-foreground", className)}
    >
      {label ? (
        <span className="font-medium text-foreground text-sm">{label}</span>
      ) : null}
      <canvas
        aria-hidden="true"
        className="block"
        height={height}
        ref={canvasRef}
        style={{ height: `${height}px`, width: `${width}px` }}
        tabIndex={-1}
        width={width}
      />
      <span className="sr-only">{description}</span>
      {caption ? (
        <figcaption className="text-muted-foreground text-xs">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
};

export default DitherChart;
