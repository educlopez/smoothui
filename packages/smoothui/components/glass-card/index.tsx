"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion, useSpring } from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";

const DEFAULT_BLUR = 11;
const DEFAULT_RADIUS = 26;
const DEFAULT_REFRACTION = 24;
const DEFAULT_RIM_WIDTH = 12;
const DEFAULT_TINT = "oklch(1 0 0 / 0.1)";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const SPECULAR_SIZE = 260;
const SPECULAR_BASE_X = 0.3;
const SPECULAR_BASE_Y = 0.28;
const SWEEP_WIDTH = 42;
const RIM_SHIFT = 6;
const CONTENT_PADDING_MIN = 20;
const CONTENT_PADDING_GAP = 10;
const INNER_RADIUS_MIN = 6;
/**
 * The rim stays nearly sharp. Blur it much past a pixel and the displacement
 * is smeared away — the bend has to read as a bend, not as more frost.
 */
const RIM_BLUR_RATIO = 0.12;

/** Critically damped: light on glass should settle, never wobble. */
const SPRING = { damping: 34, mass: 0.5, stiffness: 250 } as const;
const LIFT = { scale: 1.006, y: -3 };

const SPECULAR_GRADIENT =
  "radial-gradient(closest-side, oklch(1 0 0 / 0.3), oklch(1 0 0 / 0.07) 48%, transparent 74%)";
const SWEEP_GRADIENT =
  "linear-gradient(to bottom, oklch(1 0 0 / 0.92), oklch(1 0 0 / 0.22) 55%, transparent)";
const SWEEP_MASK =
  "linear-gradient(90deg, transparent, oklch(0 0 0) 42%, oklch(0 0 0) 58%, transparent)";
/** Cyan on one edge, magenta on the other: glass splits light as it bends it. */
const CHROMATIC_RIM =
  "linear-gradient(125deg, oklch(0.84 0.12 215 / 0.4) 0%, transparent 36%, transparent 64%, oklch(0.78 0.15 340 / 0.34) 100%)";
/** Polished inner edge, so the rim reads as one thick pane, not a nested box. */
const BODY_EDGE =
  "inset 0 1px 0 oklch(1 0 0 / 0.22), inset 0 0 0 1px oklch(1 0 0 / 0.07)";
const BOTTOM_SHADE =
  "linear-gradient(to bottom, transparent 48%, oklch(0 0 0 / 0.2) 100%)";
const INNER_RING =
  "inset 0 1px 0 oklch(1 0 0 / 0.55), inset 0 0 0 1px oklch(1 0 0 / 0.15), inset 0 -1px 0 oklch(1 0 0 / 0.12)";
const DROP_SHADOW =
  "0 26px 60px -26px oklch(0 0 0 / 0.6), 0 10px 26px -18px oklch(0 0 0 / 0.45)";

/**
 * Clips a layer to a ring of `width` px along the border box, so the
 * refractive edge only ever samples the backdrop at the rim.
 */
const ringMask = (width: number): CSSProperties => ({
  boxSizing: "border-box",
  maskClip: "content-box, border-box",
  maskComposite: "exclude",
  maskImage:
    "linear-gradient(oklch(0 0 0), oklch(0 0 0)), linear-gradient(oklch(0 0 0), oklch(0 0 0))",
  padding: width,
  WebkitMaskClip: "content-box, border-box",
  WebkitMaskComposite: "xor",
  WebkitMaskImage:
    "linear-gradient(oklch(0 0 0), oklch(0 0 0)), linear-gradient(oklch(0 0 0), oklch(0 0 0))",
});

export interface GlassCardProps {
  /** Backdrop blur strength of the pane body, in px. */
  blur?: number;
  /** Draws the inset highlight line that reads as the polished inner edge. */
  border?: boolean;
  children: ReactNode;
  className?: string;
  /** Tracks the pointer for the specular sweep and adds a subtle hover lift. */
  interactive?: boolean;
  /** Corner radius in px. */
  radius?: number;
  /**
   * Displacement strength of the refractive rim, in px. `0` keeps the rim but
   * removes the bend, which is the honest before/after comparison.
   */
  refraction?: number;
  /** Thickness of the refractive rim, in px. Thin rims read as a plain border. */
  rimWidth?: number;
  /** Casts a layered drop shadow so the pane floats above its backdrop. */
  shadow?: boolean;
  /** Renders the pointer-tracked specular highlight and top-edge sweep. */
  specular?: boolean;
  /** Frosted body tint (any valid CSS color). */
  tint?: string;
}

export default function GlassCard({
  blur = DEFAULT_BLUR,
  border = true,
  children,
  className,
  interactive = true,
  radius = DEFAULT_RADIUS,
  refraction = DEFAULT_REFRACTION,
  rimWidth = DEFAULT_RIM_WIDTH,
  shadow = true,
  specular = true,
  tint = DEFAULT_TINT,
}: GlassCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const rawId = useId();
  const filterId = `glass-refraction-${rawId.replace(/:/g, "")}`;
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const [canDisplace, setCanDisplace] = useState(false);

  const specularX = useSpring(0, SPRING);
  const specularY = useSpring(0, SPRING);
  const sweepX = useSpring(0, SPRING);
  const rimX = useSpring(0, SPRING);
  const rimY = useSpring(0, SPRING);

  const tracksPointer = interactive && isHoverDevice && !shouldReduceMotion;

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const query = window.matchMedia(HOVER_QUERY);
    setIsHoverDevice(query.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setIsHoverDevice(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Only Chromium composites an SVG displacement inside `backdrop-filter`.
  // Everywhere else the rim keeps its blur and drops the bend instead of
  // invalidating the whole declaration.
  useEffect(() => {
    if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
      return;
    }
    const probe = `url(#${filterId}) blur(2px)`;
    setCanDisplace(
      CSS.supports("backdrop-filter", probe) ||
        CSS.supports("-webkit-backdrop-filter", probe)
    );
  }, [filterId]);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;
      specularX.set(pointerX - rect.width * SPECULAR_BASE_X);
      specularY.set(pointerY - rect.height * SPECULAR_BASE_Y);
      sweepX.set(pointerX - rect.width / 2);
      rimX.set((pointerX / rect.width - 0.5) * RIM_SHIFT);
      rimY.set((pointerY / rect.height - 0.5) * RIM_SHIFT);
    },
    [rimX, rimY, specularX, specularY, sweepX]
  );

  const handlePointerLeave = useCallback(() => {
    for (const value of [specularX, specularY, sweepX, rimX, rimY]) {
      value.set(0);
    }
  }, [rimX, rimY, specularX, specularY, sweepX]);

  const bodyFilters = `blur(${blur}px) saturate(160%) brightness(1.02)`;
  const rimBlur = Math.max(1, Math.round(blur * RIM_BLUR_RATIO));
  const rimFilters = `blur(${rimBlur}px) saturate(172%) brightness(1.07)`;
  const displaces = refraction > 0 && canDisplace;
  const rimBackdrop = displaces
    ? `url(#${filterId}) ${rimFilters}`
    : rimFilters;
  const contentPadding = Math.max(
    CONTENT_PADDING_MIN,
    rimWidth + CONTENT_PADDING_GAP
  );

  return (
    <motion.div
      className={cn("relative overflow-hidden", className)}
      onPointerLeave={tracksPointer ? handlePointerLeave : undefined}
      onPointerMove={tracksPointer ? handlePointerMove : undefined}
      style={{
        borderRadius: radius,
        boxShadow: shadow ? DROP_SHADOW : undefined,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { bounce: 0, duration: 0.3, type: "spring" }
      }
      whileHover={tracksPointer ? LIFT : undefined}
    >
      {displaces ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0"
          focusable="false"
        >
          <title>Refractive glass edge</title>
          <defs>
            <filter id={filterId}>
              <feTurbulence
                baseFrequency="0.016 0.024"
                numOctaves={2}
                result="noise"
                seed={7}
                type="fractalNoise"
              />
              <feGaussianBlur in="noise" result="soft" stdDeviation={1.4} />
              <feDisplacementMap
                in="SourceGraphic"
                in2="soft"
                scale={refraction}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      ) : null}

      {/* Frosted body, inset so the rim below samples the raw backdrop. */}
      <div
        aria-hidden="true"
        className="absolute"
        style={{
          backdropFilter: bodyFilters,
          backgroundColor: tint,
          borderRadius: Math.max(radius - rimWidth, INNER_RADIUS_MIN),
          boxShadow: BODY_EDGE,
          inset: rimWidth,
          WebkitBackdropFilter: bodyFilters,
        }}
      />

      {/* Refractive rim: the edge that visibly bends what sits behind it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[inherit]"
        style={{
          ...ringMask(rimWidth),
          backdropFilter: rimBackdrop,
          WebkitBackdropFilter: rimBackdrop,
        }}
      />

      {/* Light layers, isolated so blending never leaks past the pane. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit]"
      >
        <motion.div
          className="absolute inset-0 rounded-[inherit]"
          style={{
            ...ringMask(rimWidth),
            backgroundImage: CHROMATIC_RIM,
            mixBlendMode: "plus-lighter",
            x: rimX,
            y: rimY,
          }}
        />

        {specular ? (
          <motion.div
            className="absolute"
            style={{
              backgroundImage: SPECULAR_GRADIENT,
              height: SPECULAR_SIZE,
              left: `${SPECULAR_BASE_X * 100}%`,
              marginLeft: -SPECULAR_SIZE / 2,
              marginTop: -SPECULAR_SIZE / 2,
              mixBlendMode: "plus-lighter",
              top: `${SPECULAR_BASE_Y * 100}%`,
              width: SPECULAR_SIZE,
              willChange: "transform",
              x: specularX,
              y: specularY,
            }}
          />
        ) : null}

        {specular ? (
          <motion.div
            className="absolute top-0"
            style={{
              backgroundImage: SWEEP_GRADIENT,
              height: rimWidth + 2,
              left: `${50 - SWEEP_WIDTH / 2}%`,
              maskImage: SWEEP_MASK,
              mixBlendMode: "plus-lighter",
              WebkitMaskImage: SWEEP_MASK,
              width: `${SWEEP_WIDTH}%`,
              willChange: "transform",
              x: sweepX,
            }}
          />
        ) : null}

        <div
          className="absolute inset-0 rounded-[inherit]"
          style={{ backgroundImage: BOTTOM_SHADE }}
        />
      </div>

      {border ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ boxShadow: INNER_RING }}
        />
      ) : null}

      <div className="relative" style={{ padding: contentPadding }}>
        {children}
      </div>
    </motion.div>
  );
}
