"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

export type PerspectiveTextDriver = "scroll" | "pointer" | "static";
export type PerspectiveTextSplit = "lines" | "words";

export interface PerspectiveText3DProps {
  /** Alternative to `text` when the content is static JSX-free copy. */
  children?: string;
  className?: string;
  /** Scrollable ancestor observed when `driver` is "scroll". */
  container?: RefObject<HTMLElement | null>;
  /** Z-axis separation between lines/words, in pixels. */
  depth?: number;
  driver?: PerspectiveTextDriver;
  /** CSS perspective distance, in pixels. */
  perspective?: number;
  /** Maximum rotation around the X axis, in degrees. */
  rotateX?: number;
  /** Maximum rotation around the Y axis, in degrees. */
  rotateY?: number;
  split?: PerspectiveTextSplit;
  text?: string;
}

const DEFAULT_PERSPECTIVE = 800;
const DEFAULT_DEPTH = 40;
const DEFAULT_ROTATE_X = 8;
const DEFAULT_ROTATE_Y = 10;
const POINTER_RANGE_MULTIPLIER = 2;
const SPRING_TRANSITION = {
  bounce: 0.1,
  duration: 0.25,
  type: "spring" as const,
};

const splitContent = (
  content: string,
  split: PerspectiveTextSplit
): string[] => {
  if (split === "words") {
    return content.split(/\s+/).filter((segment) => segment.length > 0);
  }
  const lines = content.split("\n").filter((line) => line.length > 0);
  return lines.length > 0 ? lines : [content];
};

/**
 * PerspectiveText3D — text on a 3D plane that tilts and separates in
 * depth. Lines or words are pushed along the Z axis and the whole plane
 * reacts to scroll progress or the pointer.
 */
export default function PerspectiveText3D({
  children,
  className,
  container,
  depth = DEFAULT_DEPTH,
  driver = "static",
  perspective = DEFAULT_PERSPECTIVE,
  rotateX = DEFAULT_ROTATE_X,
  rotateY = DEFAULT_ROTATE_Y,
  split = "words",
  text,
}: PerspectiveText3DProps) {
  const content = text ?? children ?? "";
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [pointerTilt, setPointerTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || driver !== "pointer" || shouldReduceMotion) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
      setPointerTilt({
        x: -relativeY * rotateX * POINTER_RANGE_MULTIPLIER,
        y: relativeX * rotateY * POINTER_RANGE_MULTIPLIER,
      });
    };
    const handlePointerLeave = () => setPointerTilt({ x: 0, y: 0 });

    wrapper.addEventListener("pointermove", handlePointerMove);
    wrapper.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      wrapper.removeEventListener("pointermove", handlePointerMove);
      wrapper.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [driver, rotateX, rotateY, shouldReduceMotion]);

  const { scrollYProgress } = useScroll({ container, target: wrapperRef });
  const scrollRotateXRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [rotateX, -rotateX]
  );
  const scrollRotateYRaw = useTransform(
    scrollYProgress,
    [0, 1],
    [-rotateY, rotateY]
  );
  const scrollRotateX = useSpring(scrollRotateXRaw, SPRING_TRANSITION);
  const scrollRotateY = useSpring(scrollRotateYRaw, SPRING_TRANSITION);

  if (shouldReduceMotion) {
    return (
      <p className={className} style={{ whiteSpace: "pre-line" }}>
        {content}
      </p>
    );
  }

  const segments = splitContent(content, split);
  const midIndex = (segments.length - 1) / 2;
  const planeAnimate =
    driver === "pointer"
      ? { rotateX: pointerTilt.x, rotateY: pointerTilt.y }
      : driver === "static"
        ? { rotateX, rotateY }
        : undefined;
  const planeInitial =
    driver === "scroll" ? undefined : { rotateX: 0, rotateY: 0 };

  return (
    <div
      aria-label={content}
      className={cn("inline-block", className)}
      ref={wrapperRef}
      style={{ perspective }}
    >
      <motion.div
        animate={planeAnimate}
        initial={planeInitial}
        style={{
          transformStyle: "preserve-3d",
          ...(driver === "scroll"
            ? { rotateX: scrollRotateX, rotateY: scrollRotateY }
            : {}),
        }}
        transition={SPRING_TRANSITION}
      >
        {segments.map((segment, index) => (
          <div
            aria-hidden="true"
            // biome-ignore lint/suspicious/noArrayIndexKey: segments have no stable id
            key={index}
            style={{
              display: split === "lines" ? "block" : "inline-block",
              transform: `translateZ(${(index - midIndex) * depth}px)`,
            }}
          >
            {segment}
            {split === "words" && index < segments.length - 1 ? " " : null}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
