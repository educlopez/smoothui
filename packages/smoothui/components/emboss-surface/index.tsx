"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useId,
  useState,
} from "react";

export type EmbossSurfaceVariant =
  | "emboss"
  | "deboss"
  | "plaster"
  | "metal-stamp";

export interface EmbossSurfaceProps {
  /** Element or component rendered as the material surface. Defaults to `div`. */
  as?: ElementType;
  /** Content that receives the relief. */
  children: ReactNode;
  /** Extra classes for the surface. */
  className?: string;
  /** Base material colour. Any CSS colour; defaults to the `background` token. */
  color?: string;
  /** Relief depth in pixels. */
  depth?: number;
  /** Let the light angle follow the pointer on hover-capable devices. */
  interactive?: boolean;
  /** Direction the light comes from, in degrees. `0` is right, `90` is up. */
  lightAngle?: number;
  /** Shadow diffusion, `0` (hard) to `1` (soft). */
  softness?: number;
  /** Material recipe used to build the relief. */
  variant?: EmbossSurfaceVariant;
}

interface VariantSpec {
  blurScale: number;
  hardEdge: boolean;
  highlightMix: number;
  inset: boolean;
  invert: boolean;
  shadeMix: number;
  specular: boolean;
}

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const DEFAULT_DEPTH = 2;
const DEFAULT_LIGHT_ANGLE = 135;
const DEFAULT_SOFTNESS = 0.5;
const DEFAULT_COLOR = "var(--color-background)";
const SOFTNESS_SCALE = 2.4;
const MIN_BLUR = 0.25;
const DEGREES_PER_TURN = 360;
const HARD_LAYER_SCALE = 1.8;
const DROP_SHADOW_BLUR_SCALE = 0.6;
const SPECULAR_ELEVATION = 42;
const SPECULAR_CONSTANT = 0.9;
const SPECULAR_EXPONENT = 18;
const SPECULAR_SURFACE_SCALE = 3;
const RADIANS_PER_DEGREE = Math.PI / 180;
const UNSAFE_ID_CHARS = /[^a-zA-Z0-9_-]/g;

const VARIANTS: Record<EmbossSurfaceVariant, VariantSpec> = {
  deboss: {
    blurScale: 1,
    hardEdge: false,
    highlightMix: 46,
    inset: true,
    invert: true,
    shadeMix: 34,
    specular: false,
  },
  emboss: {
    blurScale: 1,
    hardEdge: false,
    highlightMix: 46,
    inset: false,
    invert: false,
    shadeMix: 34,
    specular: false,
  },
  "metal-stamp": {
    blurScale: 0.45,
    hardEdge: true,
    highlightMix: 72,
    inset: false,
    invert: false,
    shadeMix: 58,
    specular: false,
  },
  plaster: {
    blurScale: 1.8,
    hardEdge: false,
    highlightMix: 64,
    inset: true,
    invert: true,
    shadeMix: 26,
    specular: true,
  },
};

const BLUR_VAR = "calc(var(--es-blur) * 1px)";

const offsetLayer = (scale: number, blur: string, tint: string) =>
  `calc(var(--es-dx) * ${scale}px) calc(var(--es-dy) * ${scale}px) ${blur} ${tint}`;

const buildShadow = (
  spec: VariantSpec,
  highlight: string,
  shade: string,
  prefix: string
) => {
  const sign = spec.invert ? -1 : 1;
  const layers = [
    `${prefix}${offsetLayer(sign, BLUR_VAR, highlight)}`,
    `${prefix}${offsetLayer(-sign, BLUR_VAR, shade)}`,
  ];
  if (spec.hardEdge) {
    layers.push(
      `${prefix}${offsetLayer(sign * HARD_LAYER_SCALE, "0px", highlight)}`
    );
    layers.push(
      `${prefix}${offsetLayer(-sign * HARD_LAYER_SCALE, "0px", shade)}`
    );
  }
  return layers.join(", ");
};

const EmbossSurface = ({
  as,
  children,
  className,
  color = DEFAULT_COLOR,
  depth = DEFAULT_DEPTH,
  interactive = false,
  lightAngle = DEFAULT_LIGHT_ANGLE,
  softness = DEFAULT_SOFTNESS,
  variant = "emboss",
}: EmbossSurfaceProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const filterId = useId().replace(UNSAFE_ID_CHARS, "");

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }
    const query = window.matchMedia(HOVER_QUERY);
    setIsHoverDevice(query.matches);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverDevice(event.matches);
    };
    query.addEventListener("change", handleChange);
    return () => {
      query.removeEventListener("change", handleChange);
    };
  }, []);

  const spec = VARIANTS[variant];
  const radians = lightAngle * RADIANS_PER_DEGREE;
  const lightX = Math.cos(radians) * depth;
  const lightY = -Math.sin(radians) * depth;
  const blur = Math.max(
    MIN_BLUR,
    depth * softness * SOFTNESS_SCALE * spec.blurScale
  );

  const highlight = `color-mix(in oklab, ${color}, white ${spec.highlightMix}%)`;
  const shade = `color-mix(in oklab, ${color}, black ${spec.shadeMix}%)`;

  const tracksPointer = interactive && !shouldReduceMotion && isHoverDevice;

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      const deltaX = event.clientX - (rect.left + rect.width / 2);
      const deltaY = event.clientY - (rect.top + rect.height / 2);
      const length = Math.hypot(deltaX, deltaY);
      if (length === 0) {
        return;
      }
      element.style.setProperty("--es-dx", `${(deltaX / length) * depth}`);
      element.style.setProperty("--es-dy", `${(deltaY / length) * depth}`);
    },
    [depth]
  );

  const handlePointerLeave = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const element = event.currentTarget;
      element.style.setProperty("--es-dx", `${lightX}`);
      element.style.setProperty("--es-dy", `${lightY}`);
    },
    [lightX, lightY]
  );

  const dropShadow = spec.hardEdge
    ? `drop-shadow(${offsetLayer(1, `calc(var(--es-blur) * ${DROP_SHADOW_BLUR_SCALE}px)`, highlight)}) drop-shadow(${offsetLayer(-1, `calc(var(--es-blur) * ${DROP_SHADOW_BLUR_SCALE}px)`, shade)})`
    : undefined;

  const style = {
    "--es-blur": blur,
    "--es-dx": lightX,
    "--es-dy": lightY,
    backgroundColor: color,
    boxShadow: buildShadow(spec, highlight, shade, spec.inset ? "inset " : ""),
    filter: spec.specular ? `url(#${filterId})` : dropShadow,
    textShadow: buildShadow(spec, highlight, shade, ""),
    transition: shouldReduceMotion
      ? undefined
      : "box-shadow 240ms cubic-bezier(0.645, 0.045, 0.355, 1)",
  } as CSSProperties;

  const Tag: ElementType = as ?? "div";

  return (
    <>
      {spec.specular ? (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0"
        >
          <title>Plaster relief filter</title>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceAlpha"
              result="relief"
              stdDeviation={depth}
            />
            <feSpecularLighting
              in="relief"
              lightingColor="white"
              result="specular"
              specularConstant={SPECULAR_CONSTANT}
              specularExponent={SPECULAR_EXPONENT}
              surfaceScale={SPECULAR_SURFACE_SCALE}
            >
              <feDistantLight
                azimuth={(DEGREES_PER_TURN - lightAngle) % DEGREES_PER_TURN}
                elevation={SPECULAR_ELEVATION}
              />
            </feSpecularLighting>
            <feComposite
              in="specular"
              in2="SourceAlpha"
              operator="in"
              result="clipped"
            />
            <feComposite
              in="SourceGraphic"
              in2="clipped"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              operator="arithmetic"
            />
          </filter>
        </svg>
      ) : null}
      <Tag
        className={cn("text-foreground", className)}
        onPointerLeave={tracksPointer ? handlePointerLeave : undefined}
        onPointerMove={tracksPointer ? handlePointerMove : undefined}
        style={style}
      >
        {children}
      </Tag>
    </>
  );
};

export default EmbossSurface;
