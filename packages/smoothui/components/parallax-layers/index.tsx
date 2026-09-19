"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

/** Motion scroll offset tuple, typed from `useScroll` itself. */
export type ScrollOffset = NonNullable<
  Parameters<typeof useScroll>[0]
>["offset"];

const SCROLL_SPRING_CONFIG = {
  damping: 30,
  mass: 0.5,
  stiffness: 200,
} as const;
const POINTER_SPRING_CONFIG = {
  damping: 20,
  mass: 0.3,
  stiffness: 150,
} as const;
const POINTER_PARALLAX_MAX_PX = 20;
const DEFAULT_RANGE_PX = 80;
// Concentrated on the stretch where the scene is actually on screen: over the
// full enter-to-exit range most of the layer separation is spent off-view.
const DEFAULT_OFFSET: ScrollOffset = ["start 0.95", "end 0.6"];
const CENTER_RATIO = 0.5;

export type ParallaxDirection = "vertical" | "horizontal" | "both";

export interface ParallaxLayer {
  /** Optional blur, in pixels, applied to this layer for extra depth. */
  blur?: number;
  content: ReactNode;
  /** 0 (no movement) to 1 (maximum movement). */
  depth: number;
  id: string;
  opacity?: number;
}

export interface ParallaxLayersProps {
  className?: string;
  /** Ref to a scrollable ancestor that drives progress instead of the window. */
  container?: RefObject<HTMLElement | null>;
  direction?: ParallaxDirection;
  layers: ParallaxLayer[];
  /** Also react to pointer position on hover-capable devices. */
  pointerParallax?: boolean;
  /** Maximum travel, in pixels, at depth 1. */
  range?: number;
}

const useHoverCapable = (enabled: boolean) => {
  const [isHoverCapable, setIsHoverCapable] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverCapable(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverCapable(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [enabled]);

  return isHoverCapable;
};

interface ParallaxLayerItemProps {
  direction: ParallaxDirection;
  layer: ParallaxLayer;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  progress: MotionValue<number>;
  range: number;
}

const ParallaxLayerItem = ({
  layer,
  progress,
  pointerX,
  pointerY,
  direction,
  range,
}: ParallaxLayerItemProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { depth, blur, opacity } = layer;

  const scrollX = useTransform(
    progress,
    [0, 1],
    [-range * depth, range * depth]
  );
  const scrollY = useTransform(
    progress,
    [0, 1],
    [-range * depth, range * depth]
  );
  const pointerOffsetX = useTransform(pointerX, (latest) => latest * depth);
  const pointerOffsetY = useTransform(pointerY, (latest) => latest * depth);

  const x = useTransform([scrollX, pointerOffsetX], (latest) => {
    const [scrollValue, pointerValue] = latest as [number, number];
    return shouldReduceMotion || direction === "vertical"
      ? 0
      : scrollValue + pointerValue;
  });
  const y = useTransform([scrollY, pointerOffsetY], (latest) => {
    const [scrollValue, pointerValue] = latest as [number, number];
    return shouldReduceMotion || direction === "horizontal"
      ? 0
      : scrollValue + pointerValue;
  });

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        filter: blur ? `blur(${blur}px)` : undefined,
        opacity: opacity ?? 1,
        x,
        y,
      }}
    >
      {layer.content}
    </motion.div>
  );
};

export default function ParallaxLayers({
  layers,
  direction = "vertical",
  range = DEFAULT_RANGE_PX,
  pointerParallax = false,
  container,
  className,
}: ParallaxLayersProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const isHoverCapable = useHoverCapable(pointerParallax);

  const { scrollYProgress } = useScroll({
    container,
    offset: DEFAULT_OFFSET,
    target: ref,
  });
  const springProgress = useSpring(scrollYProgress, SCROLL_SPRING_CONFIG);

  const pointerXRaw = useMotionValue(0);
  const pointerYRaw = useMotionValue(0);
  const pointerX = useSpring(pointerXRaw, POINTER_SPRING_CONFIG);
  const pointerY = useSpring(pointerYRaw, POINTER_SPRING_CONFIG);

  useEffect(() => {
    const node = ref.current;
    const isPointerActive =
      pointerParallax && isHoverCapable && !shouldReduceMotion;

    if (!(node && isPointerActive)) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - CENTER_RATIO;
      const relativeY = (event.clientY - rect.top) / rect.height - CENTER_RATIO;
      pointerXRaw.set(relativeX * POINTER_PARALLAX_MAX_PX);
      pointerYRaw.set(relativeY * POINTER_PARALLAX_MAX_PX);
    };

    const handlePointerLeave = () => {
      pointerXRaw.set(0);
      pointerYRaw.set(0);
    };

    node.addEventListener("pointermove", handlePointerMove);
    node.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [
    pointerParallax,
    isHoverCapable,
    shouldReduceMotion,
    pointerXRaw,
    pointerYRaw,
  ]);

  return (
    <div className={cn("relative", className)} ref={ref}>
      {layers.map((layer) => (
        <ParallaxLayerItem
          direction={direction}
          key={layer.id}
          layer={layer}
          pointerX={pointerX}
          pointerY={pointerY}
          progress={springProgress}
          range={range}
        />
      ))}
    </div>
  );
}
