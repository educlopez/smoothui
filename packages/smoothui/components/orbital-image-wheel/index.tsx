"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const DEFAULT_RADIUS = 160;
const DEFAULT_AUTO_ROTATE_SPEED = 12; // degrees per second
const ITEM_SIZE = 80; // px, diameter of each thumbnail button
const ROTATE_SENSITIVITY = 0.6; // degrees per pixel of horizontal drag
const VELOCITY_SMOOTHING = 0.35;
const MOMENTUM_FRICTION = 0.94; // velocity decay per ~16ms frame
const MOMENTUM_EPSILON = 0.02; // deg/ms below which momentum stops
const SNAP_DURATION = 250; // ms
const STEP_DURATION = 250; // ms
const DRAG_MOVE_THRESHOLD = 4; // px before a pointer gesture counts as a drag

export interface OrbitalImageWheelItem {
  alt: string;
  id: string;
  image: string;
  label?: string;
}

export interface OrbitalImageWheelProps {
  /** Forces a specific item to be highlighted, overriding the automatic top-of-circle detection. */
  activeId?: string;
  autoRotate?: boolean;
  /** Degrees per second while auto-rotating. */
  autoRotateSpeed?: number;
  className?: string;
  /** Tilts each thumbnail to face outward from the center, like a ferris wheel gondola. */
  faceOutward?: boolean;
  items: OrbitalImageWheelItem[];
  onRotationChange?: (rotation: number) => void;
  /** Circle radius in px. */
  radius?: number;
  /** Controlled rotation in degrees. */
  rotation?: number;
  /** Snap to the nearest item when a drag or momentum settles. */
  snap?: boolean;
}

const normalizeAngle = (angle: number): number => {
  const wrapped = angle % 360;
  return wrapped < 0 ? wrapped + 360 : wrapped;
};

const shortestDelta = (from: number, to: number): number => {
  const diff = normalizeAngle(to - from);
  return diff > 180 ? diff - 360 : diff;
};

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

export default function OrbitalImageWheel({
  activeId,
  autoRotate = false,
  autoRotateSpeed = DEFAULT_AUTO_ROTATE_SPEED,
  className,
  faceOutward = false,
  items,
  onRotationChange,
  radius = DEFAULT_RADIUS,
  rotation,
  snap = false,
}: OrbitalImageWheelProps) {
  const shouldReduceMotion = useReducedMotion();
  const isControlled = rotation !== undefined;
  const [internalRotation, setInternalRotation] = useState(0);
  const currentRotation = isControlled
    ? (rotation as number)
    : internalRotation;

  const rotationRef = useRef(currentRotation);
  rotationRef.current = currentRotation;
  const velocityRef = useRef(0);
  const activeFrameRef = useRef<number | null>(null);
  const dragRef = useRef<{
    lastTime: number;
    lastX: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);
  const justDraggedRef = useRef(false);

  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseReasonsRef = useRef({ focus: false, hidden: false, hover: false });

  const itemAngle = items.length > 0 ? 360 / items.length : 0;

  const commitRotation = useCallback(
    (next: number) => {
      const normalized = normalizeAngle(next);
      if (!isControlled) {
        setInternalRotation(normalized);
      }
      onRotationChange?.(normalized);
    },
    [isControlled, onRotationChange]
  );

  const cancelActiveFrame = useCallback(() => {
    if (activeFrameRef.current !== null) {
      cancelAnimationFrame(activeFrameRef.current);
      activeFrameRef.current = null;
    }
  }, []);

  const nearestItemAngleTo = useCallback(
    (value: number): number => {
      if (itemAngle === 0) {
        return value;
      }
      return Math.round(value / itemAngle) * itemAngle;
    },
    [itemAngle]
  );

  const snapTo = useCallback(
    (target: number, duration = SNAP_DURATION) => {
      cancelActiveFrame();
      if (shouldReduceMotion) {
        rotationRef.current = normalizeAngle(target);
        commitRotation(rotationRef.current);
        return;
      }
      const from = rotationRef.current;
      const delta = shortestDelta(from, target);
      const start = performance.now();
      const tick = (time: number) => {
        const progress =
          duration <= 0 ? 1 : Math.min((time - start) / duration, 1);
        const eased = easeInOutCubic(progress);
        rotationRef.current = normalizeAngle(from + delta * eased);
        commitRotation(rotationRef.current);
        if (progress < 1) {
          activeFrameRef.current = requestAnimationFrame(tick);
        } else {
          activeFrameRef.current = null;
        }
      };
      activeFrameRef.current = requestAnimationFrame(tick);
    },
    [cancelActiveFrame, commitRotation, shouldReduceMotion]
  );

  const startMomentum = useCallback(() => {
    cancelActiveFrame();
    let velocity = velocityRef.current;
    let last = performance.now();
    const tick = (time: number) => {
      const dt = time - last;
      last = time;
      rotationRef.current = normalizeAngle(rotationRef.current + velocity * dt);
      velocity *= MOMENTUM_FRICTION ** (dt / 16);
      commitRotation(rotationRef.current);
      if (Math.abs(velocity) < MOMENTUM_EPSILON) {
        if (snap) {
          snapTo(nearestItemAngleTo(rotationRef.current));
        }
        activeFrameRef.current = null;
        return;
      }
      activeFrameRef.current = requestAnimationFrame(tick);
    };
    activeFrameRef.current = requestAnimationFrame(tick);
  }, [cancelActiveFrame, commitRotation, nearestItemAngleTo, snap, snapTo]);

  // Detect hover-capable pointer devices before enabling hover-based pause.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsHoverDevice(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const recomputePause = useCallback(() => {
    const { focus, hidden, hover } = pauseReasonsRef.current;
    setIsPaused(focus || hidden || hover);
  }, []);

  // Pause auto-rotate while the tab is hidden.
  useEffect(() => {
    const handleVisibility = () => {
      pauseReasonsRef.current.hidden = document.hidden;
      recomputePause();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [recomputePause]);

  // Continuous auto-rotate loop; restarts cleanly whenever paused state changes.
  useEffect(() => {
    if (shouldReduceMotion || !autoRotate || isPaused || items.length === 0) {
      return;
    }
    let raf = 0;
    let last = performance.now();
    const tick = (time: number) => {
      const dt = time - last;
      last = time;
      rotationRef.current = normalizeAngle(
        rotationRef.current + (autoRotateSpeed * dt) / 1000
      );
      commitRotation(rotationRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [
    autoRotate,
    autoRotateSpeed,
    commitRotation,
    isPaused,
    items.length,
    shouldReduceMotion,
  ]);

  useEffect(() => cancelActiveFrame, [cancelActiveFrame]);

  const handlePointerEnter = useCallback(() => {
    pauseReasonsRef.current.hover = true;
    recomputePause();
  }, [recomputePause]);

  const handlePointerLeave = useCallback(() => {
    pauseReasonsRef.current.hover = false;
    recomputePause();
  }, [recomputePause]);

  const handleFocus = useCallback(() => {
    pauseReasonsRef.current.focus = true;
    recomputePause();
  }, [recomputePause]);

  const handleBlur = useCallback(
    (event: ReactFocusEvent<HTMLDivElement>) => {
      if (event.currentTarget.contains(event.relatedTarget)) {
        return;
      }
      pauseReasonsRef.current.focus = false;
      recomputePause();
    },
    [recomputePause]
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      cancelActiveFrame();
      dragRef.current = {
        lastTime: performance.now(),
        lastX: event.clientX,
        moved: false,
        pointerId: event.pointerId,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [cancelActiveFrame]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) {
        return;
      }
      const now = performance.now();
      const dx = event.clientX - drag.lastX;
      if (Math.abs(dx) > DRAG_MOVE_THRESHOLD) {
        drag.moved = true;
      }
      const dt = Math.max(now - drag.lastTime, 1);
      const delta = dx * ROTATE_SENSITIVITY;
      velocityRef.current =
        velocityRef.current * (1 - VELOCITY_SMOOTHING) +
        (delta / dt) * VELOCITY_SMOOTHING;
      rotationRef.current = normalizeAngle(rotationRef.current + delta);
      commitRotation(rotationRef.current);
      drag.lastX = event.clientX;
      drag.lastTime = now;
    },
    [commitRotation]
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      dragRef.current = null;
      if (!drag) {
        return;
      }
      event.currentTarget.releasePointerCapture(drag.pointerId);
      justDraggedRef.current = drag.moved;
      if (shouldReduceMotion) {
        velocityRef.current = 0;
        if (snap) {
          snapTo(nearestItemAngleTo(rotationRef.current));
        }
        return;
      }
      startMomentum();
    },
    [nearestItemAngleTo, shouldReduceMotion, snap, snapTo, startMomentum]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        snapTo(
          rotationRef.current - itemAngle,
          shouldReduceMotion ? 0 : STEP_DURATION
        );
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        snapTo(
          rotationRef.current + itemAngle,
          shouldReduceMotion ? 0 : STEP_DURATION
        );
      }
    },
    [itemAngle, shouldReduceMotion, snapTo]
  );

  const handleItemActivate = useCallback(
    (position: number) => {
      if (justDraggedRef.current) {
        justDraggedRef.current = false;
        return;
      }
      snapTo(-(position * itemAngle));
    },
    [itemAngle, snapTo]
  );

  const nearestTopId = useMemo(() => {
    if (items.length === 0) {
      return;
    }
    let bestId = items[0].id;
    let bestDistance = Number.POSITIVE_INFINITY;
    for (const [position, item] of items.entries()) {
      const angle = normalizeAngle(position * itemAngle + currentRotation);
      const distance = Math.abs(shortestDelta(angle, 0));
      if (distance < bestDistance) {
        bestDistance = distance;
        bestId = item.id;
      }
    }
    return bestId;
  }, [items, itemAngle, currentRotation]);

  const highlightedId = activeId ?? nearestTopId;
  const highlightedItem = items.find((item) => item.id === highlightedId);
  const diameter = radius * 2 + ITEM_SIZE;

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Interactive draggable widget requires event handlers
    <div
      aria-label="Orbital image wheel"
      className={cn("relative mx-auto touch-none select-none", className)}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerEnter={isHoverDevice ? handlePointerEnter : undefined}
      onPointerLeave={isHoverDevice ? handlePointerLeave : undefined}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      role="application"
      style={{ height: diameter, width: diameter }}
    >
      {items.map((item, position) => {
        const angle = normalizeAngle(position * itemAngle + currentRotation);
        const angleRad = (angle * Math.PI) / 180;
        const x = radius * Math.sin(angleRad);
        const y = -radius * Math.cos(angleRad);
        const isActive = highlightedId === item.id;

        return (
          <button
            aria-current={isActive ? "true" : undefined}
            aria-label={item.label ?? item.alt}
            className={cn(
              "absolute top-1/2 left-1/2 flex items-center justify-center overflow-hidden rounded-full border-2 border-transparent shadow-md transition-[border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2",
              isActive && "border-brand shadow-lg"
            )}
            key={item.id}
            onClick={() => handleItemActivate(position)}
            style={{
              height: ITEM_SIZE,
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${
                faceOutward ? angle : 0
              }deg)`,
              width: ITEM_SIZE,
              zIndex: Math.round(y),
            }}
            type="button"
          >
            <img
              alt={item.alt}
              className="h-full w-full object-cover"
              draggable={false}
              src={item.image}
            />
          </button>
        );
      })}
      <span aria-live="polite" className="sr-only">
        {highlightedItem
          ? `${highlightedItem.label ?? highlightedItem.alt} selected`
          : null}
      </span>
    </div>
  );
}
