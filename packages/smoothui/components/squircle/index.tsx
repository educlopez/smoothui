"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const DEFAULT_RADIUS = 24;
const DEFAULT_SMOOTHING = 0.6;
const EXPONENT_BASE = 2;
const EXPONENT_RANGE = 4;
const MIN_RATIO = 0;
const MAX_RATIO = 1;
/**
 * Corners are traced as polylines, so the sample count has to grow with the
 * corner: 12 samples read as smooth on a 24px radius and visibly faceted on a
 * 96px one.
 */
const MIN_SAMPLES = 12;
const MAX_SAMPLES = 48;
const SAMPLES_PER_PX = 0.5;
const QUARTER_TURN = Math.PI / 2;

export interface SquircleProps {
  as?: ElementType;
  border?: boolean;
  children?: ReactNode;
  className?: string;
  radius?: number;
  smoothing?: number;
}

interface Point {
  x: number;
  y: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const superellipseExponent = (smoothing: number) =>
  EXPONENT_BASE + clamp(smoothing, MIN_RATIO, MAX_RATIO) * EXPONENT_RANGE;

const sampleCount = (radius: number) =>
  Math.round(clamp(radius * SAMPLES_PER_PX, MIN_SAMPLES, MAX_SAMPLES));

const quadrantPoints = (radius: number, exponent: number): Point[] => {
  const samples = sampleCount(radius);
  const points: Point[] = [];
  for (let i = 1; i <= samples; i++) {
    const t = QUARTER_TURN * (i / samples);
    const x = radius * Math.cos(t) ** (2 / exponent);
    const y = radius * Math.sin(t) ** (2 / exponent);
    points.push({ x, y });
  }
  return points;
};

const formatPoint = ({ x, y }: Point) => `${x.toFixed(2)},${y.toFixed(2)}`;

/**
 * Builds an SVG path (for use with `clip-path: path(...)`) that traces a
 * rectangle whose four corners follow a superellipse (squircle) curve
 * instead of a plain circular arc, giving the smoother, curvature-continuous
 * look Apple's icons use. `smoothing` (0..1) maps to the superellipse
 * exponent: 0 is exactly a circular corner — identical to `border-radius` —
 * and 1 pushes the curve out into the flat edges.
 */
export const squirclePath = (
  width: number,
  height: number,
  radius: number = DEFAULT_RADIUS,
  smoothing: number = DEFAULT_SMOOTHING
): string => {
  if (width <= 0 || height <= 0) {
    return "";
  }

  const r = clamp(radius, 0, Math.min(width, height) / 2);

  if (r <= 0) {
    return `M0,0 L${width},0 L${width},${height} L0,${height} Z`;
  }

  const exponent = superellipseExponent(smoothing);
  const quadrant = quadrantPoints(r, exponent);

  const topRight = quadrant.map(({ x, y }) => ({ x: width - r + y, y: r - x }));
  const bottomRight = quadrant.map(({ x, y }) => ({
    x: width - r + x,
    y: height - r + y,
  }));
  const bottomLeft = quadrant.map(({ x, y }) => ({
    x: r - y,
    y: height - r + x,
  }));
  const topLeft = quadrant.map(({ x, y }) => ({ x: r - x, y: r - y }));

  const segments = [
    `M${r.toFixed(2)},0`,
    `L${(width - r).toFixed(2)},0`,
    ...topRight.map((point) => `L${formatPoint(point)}`),
    `L${width.toFixed(2)},${(height - r).toFixed(2)}`,
    ...bottomRight.map((point) => `L${formatPoint(point)}`),
    `L${r.toFixed(2)},${height.toFixed(2)}`,
    ...bottomLeft.map((point) => `L${formatPoint(point)}`),
    `L0,${r.toFixed(2)}`,
    ...topLeft.map((point) => `L${formatPoint(point)}`),
    "Z",
  ];

  return segments.join(" ");
};

export default function Squircle({
  as,
  border = false,
  children,
  className,
  radius = DEFAULT_RADIUS,
  smoothing = DEFAULT_SMOOTHING,
}: SquircleProps) {
  const Wrapper = as ?? "div";
  const elementRef = useRef<HTMLElement | null>(null);
  const [size, setSize] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return;
    }

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setSize({ height: rect.height, width: rect.width });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  // The generated path is the only code path on purpose: CSS
  // `corner-shape: squircle` is a single fixed shape that silently ignores
  // `smoothing`, so switching to it where supported made the same props render
  // two different corners.
  const clipPath = useMemo(() => {
    if (size.width === 0 || size.height === 0) {
      return;
    }
    const path = squirclePath(size.width, size.height, radius, smoothing);
    return path ? `path('${path}')` : undefined;
  }, [radius, smoothing, size.height, size.width]);

  const style: CSSProperties = { borderRadius: radius, clipPath };

  return (
    <Wrapper
      className={cn(border && "border border-foreground/20", className)}
      ref={elementRef}
      style={style}
    >
      {children}
    </Wrapper>
  );
}
