"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

/** Corner geometry: a pixel radius, or an Apple-style continuous squircle. */
export type BorderBeamRadius = number | "squircle";

export interface BorderBeamProps {
  /** Keep the beams travelling. Set to `false` to freeze and hide them. */
  active?: boolean;
  /** How many beams ride the border, evenly phase-offset around the loop. */
  beams?: number;
  /** Thickness of the border ring in pixels. */
  borderWidth?: number;
  children?: ReactNode;
  className?: string;
  /** Trailing colour of the beam gradient. Use a light, saturated colour. */
  colorFrom?: string;
  /** Leading colour of the beam gradient. Use a light, saturated colour. */
  colorTo?: string;
  /** Seconds to wait before the first lap. */
  delay?: number;
  /** Seconds for one full lap of the border. */
  duration?: number;
  /** Pause the beams while a fine pointer hovers the element. */
  pauseOnHover?: boolean;
  /** Corner geometry of both the ring and the travel path. */
  radius?: BorderBeamRadius;
  /** Travel counter-clockwise. */
  reverse?: boolean;
  /** Arc length of each beam, in pixels measured along the border. */
  size?: number;
}

const DEFAULT_SIZE = 72;
const DEFAULT_DURATION = 6;
const DEFAULT_DELAY = 0;
const DEFAULT_BEAMS = 1;
const DEFAULT_RADIUS = 16;
const DEFAULT_BORDER_WIDTH = 1;

const MS_PER_SECOND = 1000;
const HALF = 0.5;
const MIN_LAP_SECONDS = 0.1;
const OFFSET_PRECISION = 5;

/** The comet is one dash on a path normalised to `pathLength={1}`. */
const PATH_UNIT = 1;
const MIN_COMET_FRACTION = 0.02;
const MAX_COMET_FRACTION = 0.45;

const CORE_WIDTH_FACTOR = 2.6;
const MIN_CORE_WIDTH = 2.5;

/**
 * Four core dashes, not six, and one halo instead of two. Each dash is another
 * semi-opaque layer compositing over the last, so every extra one costs a paint
 * and buys less taper than the one before. Four is where the falloff stops
 * reading as steps: alpha lands on 0.14 / 0.48 / 0.82 / 0.98 towards the head.
 */
const CORE_LAYERS = 4;
/** Shortest dash — the head — as a share of the full comet length. */
const CORE_MIN_LENGTH_RATIO = 0.1;
/** >1 clusters the short dashes near the head, which is where the taper reads. */
const CORE_LENGTH_EXPONENT = 1.8;
const CORE_HEAD_OPACITY = 0.9;
const CORE_TAIL_OPACITY = 0.14;
/** A beam of light barely thins along its trail; only the halo widens. */
const CORE_WIDTH_TAPER = 0.12;
/** Just enough bloom to feather the seam between two stacked dashes. */
const CORE_BLUR_FACTOR = 0.2;
const MIN_CORE_BLUR = 0.5;

const HALO_WIDTH_FACTOR = 2.4;
const HALO_LENGTH_RATIO = 0.92;
const HALO_OPACITY = 0.34;
const HALO_BLUR_FACTOR = 0.7;
const MIN_HALO_BLUR = 4;
/** How far each halo stop is pushed towards white. */
const HALO_TINT = "68%";

const RING_ACTIVE_OPACITY = 0.7;
const RING_STATIC_OPACITY = 1;

const SQUIRCLE_CORNER_RATIO = 0.3;
const SQUIRCLE_CONTROL_RATIO = 0.76;

interface Size {
  height: number;
  width: number;
}

const EMPTY_SIZE: Size = { height: 0, width: 0 };

/** One stroked dash of the comet stack: length, weight and alpha at its head. */
interface CometLayer {
  blurred: boolean;
  id: string;
  length: number;
  opacity: number;
  width: number;
}

const buildBorderPath = (
  width: number,
  height: number,
  radius: BorderBeamRadius,
  inset: number
): string => {
  const x = inset;
  const y = inset;
  const w = Math.max(0, width - inset * 2);
  const h = Math.max(0, height - inset * 2);

  if (radius === "squircle") {
    const corner = Math.min(w, h) * SQUIRCLE_CORNER_RATIO;
    const k = corner * SQUIRCLE_CONTROL_RATIO;
    return [
      `M ${x + corner} ${y}`,
      `L ${x + w - corner} ${y}`,
      `C ${x + w - corner + k} ${y} ${x + w} ${y + corner - k} ${x + w} ${y + corner}`,
      `L ${x + w} ${y + h - corner}`,
      `C ${x + w} ${y + h - corner + k} ${x + w - corner + k} ${y + h} ${x + w - corner} ${y + h}`,
      `L ${x + corner} ${y + h}`,
      `C ${x + corner - k} ${y + h} ${x} ${y + h - corner + k} ${x} ${y + h - corner}`,
      `L ${x} ${y + corner}`,
      `C ${x} ${y + corner - k} ${x + corner - k} ${y} ${x + corner} ${y}`,
      "Z",
    ].join(" ");
  }

  const r = Math.max(0, Math.min(radius, Math.min(w, h) * HALF));
  return [
    `M ${x + r} ${y}`,
    `H ${x + w - r}`,
    `A ${r} ${r} 0 0 1 ${x + w} ${y + r}`,
    `V ${y + h - r}`,
    `A ${r} ${r} 0 0 1 ${x + w - r} ${y + h}`,
    `H ${x + r}`,
    `A ${r} ${r} 0 0 1 ${x} ${y + h - r}`,
    `V ${y + r}`,
    `A ${r} ${r} 0 0 1 ${x + r} ${y}`,
    "Z",
  ].join(" ");
};

/** Wraps a normalised offset back into `[0, 1)` so the dash never falls off. */
const wrapUnit = (value: number) =>
  ((value % PATH_UNIT) + PATH_UNIT) % PATH_UNIT;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Blurring a stroke darkens its fringe whenever the stroke itself is dark, so
 * the halo never inherits the beam colour verbatim — it is pushed towards white
 * first. A glow is light by definition; a dark blur is a shadow.
 */
const toHaloStop = (color: string) =>
  `color-mix(in oklab, ${color} ${HALO_TINT}, white)`;

const BorderBeam = ({
  active = true,
  beams = DEFAULT_BEAMS,
  borderWidth = DEFAULT_BORDER_WIDTH,
  children,
  className,
  colorFrom = "var(--color-brand)",
  colorTo = "var(--color-brand-light)",
  delay = DEFAULT_DELAY,
  duration = DEFAULT_DURATION,
  pauseOnHover = false,
  radius = DEFAULT_RADIUS,
  reverse = false,
  size = DEFAULT_SIZE,
}: BorderBeamProps) => {
  const shouldReduceMotion = useReducedMotion();
  const rawId = useId();
  const beamGradientId = `${rawId}-beam`;
  const haloGradientId = `${rawId}-halo`;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGPathElement>(null);
  const cometRef = useRef<SVGGElement>(null);
  const dashRefs = useRef<(SVGPathElement | null)[]>([]);
  const pausedRef = useRef(false);
  const offscreenRef = useRef(false);
  const [{ height, width }, setSize] = useState<Size>(EMPTY_SIZE);
  const [perimeter, setPerimeter] = useState(0);

  const beamCount = Math.max(1, Math.round(beams));
  const hasBox = width > 0 && height > 0;
  const path = hasBox
    ? buildBorderPath(width, height, radius, borderWidth * HALF)
    : "";
  const isTravelling = active && !shouldReduceMotion && hasBox && perimeter > 0;
  const headWidth = Math.max(MIN_CORE_WIDTH, borderWidth * CORE_WIDTH_FACTOR);
  const haloBlur = Math.max(MIN_HALO_BLUR, headWidth * HALO_BLUR_FACTOR);
  const coreBlur = Math.max(MIN_CORE_BLUR, headWidth * CORE_BLUR_FACTOR);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }
    const measure = () => {
      const rect = wrapper.getBoundingClientRect();
      setSize({ height: rect.height, width: rect.width });
    };
    const observer = new ResizeObserver(measure);
    measure();
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // The comet's arc length is authored in pixels, so it needs the real
  // perimeter of the current outline before it can be normalised to path units.
  useEffect(() => {
    const ring = ringRef.current;
    setPerimeter(ring && path ? ring.getTotalLength() : 0);
  }, [path]);

  const layers = useMemo<CometLayer[]>(() => {
    if (perimeter <= 0) {
      return [];
    }
    const comet = clamp(
      size / perimeter,
      MIN_COMET_FRACTION,
      MAX_COMET_FRACTION
    );
    const lastIndex = CORE_LAYERS - 1;
    // Every core dash ends at the same head position, so the exposed far end of
    // the longest one reads as the faint tip of the tail and the overlap at the
    // head accumulates into the brightest point.
    const core = Array.from({ length: CORE_LAYERS }, (_unused, index) => {
      const ratio = index / lastIndex;
      const growth =
        CORE_MIN_LENGTH_RATIO +
        (1 - CORE_MIN_LENGTH_RATIO) * ratio ** CORE_LENGTH_EXPONENT;
      return {
        blurred: false,
        id: `core-${index.toString()}`,
        length: comet * growth,
        opacity:
          CORE_HEAD_OPACITY + (CORE_TAIL_OPACITY - CORE_HEAD_OPACITY) * ratio,
        width: headWidth * (1 - CORE_WIDTH_TAPER * ratio),
      };
    });

    return [
      {
        blurred: true,
        id: "halo",
        length: comet * HALO_LENGTH_RATIO,
        opacity: HALO_OPACITY,
        width: headWidth * HALO_WIDTH_FACTOR,
      },
      ...core,
    ];
  }, [headWidth, perimeter, size]);

  // The comet is the outline itself: every layer is a dash stroked along the
  // same `d`, so it is curved by construction and cannot leave the border. Only
  // `stroke-dashoffset` moves, which slides the dash through corners instead of
  // pivoting a straight sprite across them.
  useEffect(() => {
    if (!(isTravelling && layers.length > 0)) {
      return;
    }
    const layerCount = layers.length;
    const plan: { length: number; node: SVGPathElement; phase: number }[] = [];
    for (let index = 0; index < beamCount * layerCount; index++) {
      const node = dashRefs.current[index];
      if (node) {
        plan.push({
          length: layers[index % layerCount].length,
          node,
          phase: Math.floor(index / layerCount) / beamCount,
        });
      }
    }
    if (plan.length === 0) {
      return;
    }

    const lapSeconds = Math.max(MIN_LAP_SECONDS, duration);
    let frameId = 0;
    let lastTimestamp = performance.now();
    let elapsed = 0;

    const place = (progress: number) => {
      for (const item of plan) {
        const lap = wrapUnit(progress + item.phase);
        // Travelling backwards puts the leading end at the dash start, so the
        // tail keeps trailing the head in the direction of motion.
        const head = reverse ? PATH_UNIT - lap : lap;
        const offset = reverse ? -head : item.length - head;
        item.node.style.strokeDashoffset =
          wrapUnit(offset).toFixed(OFFSET_PRECISION);
      }
      const comet = cometRef.current;
      if (comet) {
        comet.style.opacity = "1";
      }
    };

    const tick = (timestamp: number) => {
      frameId = requestAnimationFrame(tick);
      const deltaSeconds = (timestamp - lastTimestamp) / MS_PER_SECOND;
      lastTimestamp = timestamp;
      if (pausedRef.current || offscreenRef.current) {
        return;
      }
      elapsed += deltaSeconds;
      const progress = (elapsed - delay) / lapSeconds;
      if (progress < 0) {
        return;
      }
      place(progress);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [beamCount, delay, duration, isTravelling, layers, reverse]);

  // Beams scrolled out of view keep no frame budget: the loop still runs but
  // skips every style write until the card is visible again.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        offscreenRef.current = !entry.isIntersecting;
      }
    });
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!(wrapper && pauseOnHover && isTravelling)) {
      return;
    }
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!hoverQuery.matches) {
      return;
    }

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    wrapper.addEventListener("pointerenter", pause);
    wrapper.addEventListener("pointerleave", resume);
    return () => {
      pausedRef.current = false;
      wrapper.removeEventListener("pointerenter", pause);
      wrapper.removeEventListener("pointerleave", resume);
    };
  }, [isTravelling, pauseOnHover]);

  const beamIds = Array.from(
    { length: beamCount },
    (_unused, index) => `beam-${index.toString()}`
  );

  const renderDash = (
    layer: CometLayer,
    layerIndex: number,
    beamId: string,
    beamIndex: number
  ) => (
    <path
      d={path}
      fill="none"
      key={`${beamId}-${layer.id}`}
      pathLength={PATH_UNIT}
      ref={(node) => {
        dashRefs.current[beamIndex * layers.length + layerIndex] = node;
      }}
      stroke={`url(#${layer.blurred ? haloGradientId : beamGradientId})`}
      strokeDasharray={`${layer.length} ${PATH_UNIT - layer.length}`}
      strokeDashoffset={layer.length}
      strokeLinecap="round"
      strokeOpacity={layer.opacity}
      strokeWidth={layer.width}
    />
  );

  return (
    <div
      className={cn("relative isolate", className)}
      ref={wrapperRef}
      style={
        radius === "squircle" ? undefined : { borderRadius: `${radius}px` }
      }
    >
      {children}

      {hasBox ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
          fill="none"
          viewBox={`0 0 ${width} ${height}`}
        >
          <defs>
            <linearGradient id={beamGradientId} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="100%" stopColor={colorTo} />
            </linearGradient>
            <linearGradient id={haloGradientId} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={toHaloStop(colorFrom)} />
              <stop offset="100%" stopColor={toHaloStop(colorTo)} />
            </linearGradient>
          </defs>

          {/* The ring is a hairline border, not part of the beam: keeping it off
              the beam gradient means `colorFrom`/`colorTo` can be as bright as a
              glow needs to be without turning the resting border into a stripe. */}
          <path
            d={path}
            opacity={isTravelling ? RING_ACTIVE_OPACITY : RING_STATIC_OPACITY}
            ref={ringRef}
            stroke="var(--color-border)"
            strokeWidth={borderWidth}
          />

          {isTravelling ? (
            <g ref={cometRef} style={{ opacity: 0 }}>
              {/* `plus-lighter` only where there is darkness to add light to.
                  On a light surface an additive glow washes out to nothing, so
                  the halo composites normally there and simply tints. */}
              <g
                className="dark:mix-blend-plus-lighter"
                colorInterpolationFilters="sRGB"
                style={{ filter: `blur(${haloBlur}px)` }}
              >
                {beamIds.map((beamId, beamIndex) =>
                  layers.map((layer, layerIndex) =>
                    layer.blurred
                      ? renderDash(layer, layerIndex, beamId, beamIndex)
                      : null
                  )
                )}
              </g>
              <g
                colorInterpolationFilters="sRGB"
                style={{ filter: `blur(${coreBlur}px)` }}
              >
                {beamIds.map((beamId, beamIndex) =>
                  layers.map((layer, layerIndex) =>
                    layer.blurred
                      ? null
                      : renderDash(layer, layerIndex, beamId, beamIndex)
                  )
                )}
              </g>
            </g>
          ) : null}
        </svg>
      ) : null}
    </div>
  );
};

export default BorderBeam;
