"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const DEFAULT_MAX_TILT = 12;
const DEFAULT_PERSPECTIVE = 900;
const DEFAULT_SCALE = 1.03;
const DEFAULT_GLARE_OPACITY = 0.25;
const SPRING_DURATION = 0.25;
const SPRING_BOUNCE = 0.1;
const FOCUS_TILT_RATIO = 0.35;
const PARALLAX_STRENGTH = 24;
const GLARE_CENTER_PERCENT = 50;
const NORMALIZED_RANGE = 100;

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  glare?: boolean;
  glareOpacity?: number;
  maxTilt?: number;
  parallax?: boolean;
  perspective?: number;
  scale?: number;
}

const useHoverCapable = () => {
  const [isHoverCapable, setIsHoverCapable] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverCapable(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsHoverCapable(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isHoverCapable;
};

const applyParallax = (
  container: HTMLElement,
  normalizedX: number,
  normalizedY: number
) => {
  const depthElements =
    container.querySelectorAll<HTMLElement>("[data-tilt-depth]");

  for (const element of depthElements) {
    const depth = Number.parseFloat(element.dataset.tiltDepth ?? "0");
    const boundedDepth = Number.isFinite(depth)
      ? Math.min(1, Math.max(0, depth))
      : 0;
    const translateX = normalizedX * boundedDepth * PARALLAX_STRENGTH;
    const translateY = normalizedY * boundedDepth * PARALLAX_STRENGTH;
    element.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
  }
};

const resetParallax = (container: HTMLElement) => {
  const depthElements =
    container.querySelectorAll<HTMLElement>("[data-tilt-depth]");
  for (const element of depthElements) {
    element.style.transform = "translate3d(0, 0, 0)";
  }
};

export default function TiltCard({
  children,
  className,
  glare = true,
  glareOpacity = DEFAULT_GLARE_OPACITY,
  maxTilt = DEFAULT_MAX_TILT,
  parallax = false,
  perspective = DEFAULT_PERSPECTIVE,
  scale = DEFAULT_SCALE,
}: TiltCardProps) {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const isHoverCapable = useHoverCapable();
  const isInteractive = isHoverCapable && !shouldReduceMotion;

  const containerRef = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scaleValue = useMotionValue(1);
  const glareX = useMotionValue(GLARE_CENTER_PERCENT);
  const glareY = useMotionValue(GLARE_CENTER_PERCENT);
  const glareStrength = useMotionValue(0);

  const springConfig = { bounce: SPRING_BOUNCE, duration: SPRING_DURATION };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springScale = useSpring(scaleValue, springConfig);
  const springGlareX = useSpring(glareX, springConfig);
  const springGlareY = useSpring(glareY, springConfig);
  const springGlareStrength = useSpring(glareStrength, springConfig);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${springGlareX}% ${springGlareY}%, rgba(255,255,255,${springGlareStrength}), transparent 60%)`;

  useEffect(() => {
    if (parallax) {
      return;
    }
    const container = containerRef.current;
    if (container) {
      resetParallax(container);
    }
  }, [parallax]);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isInteractive) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const normalizedY = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    rotateY.set(normalizedX * maxTilt);
    rotateX.set(-normalizedY * maxTilt);
    scaleValue.set(scale);
    glareX.set(GLARE_CENTER_PERCENT + normalizedX * (NORMALIZED_RANGE / 2));
    glareY.set(GLARE_CENTER_PERCENT + normalizedY * (NORMALIZED_RANGE / 2));
    glareStrength.set(glareOpacity);

    if (parallax) {
      applyParallax(container, normalizedX, normalizedY);
    }
  };

  const handlePointerLeave = () => {
    if (!isInteractive) {
      return;
    }

    rotateX.set(0);
    rotateY.set(0);
    scaleValue.set(1);
    glareStrength.set(0);

    const container = containerRef.current;
    if (container && parallax) {
      resetParallax(container);
    }
  };

  const handleFocus = () => {
    if (!isInteractive) {
      return;
    }

    rotateX.set(maxTilt * FOCUS_TILT_RATIO);
    rotateY.set(-maxTilt * FOCUS_TILT_RATIO);
    scaleValue.set(scale);
  };

  const handleBlur = () => {
    if (!isInteractive) {
      return;
    }

    rotateX.set(0);
    rotateY.set(0);
    scaleValue.set(1);
  };

  const interactiveHandlers = isInteractive
    ? {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onPointerLeave: handlePointerLeave,
        onPointerMove: handlePointerMove,
      }
    : {};

  return (
    <motion.div
      className={cn("relative", className)}
      ref={containerRef}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale: springScale,
        transformPerspective: perspective,
        transformStyle: "preserve-3d",
      }}
      {...interactiveHandlers}
    >
      {children}
      {glare && isInteractive ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ backgroundImage: glareBackground }}
        />
      ) : null}
    </motion.div>
  );
}
