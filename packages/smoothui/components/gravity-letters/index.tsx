"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type GravityLettersTrigger = "click" | "hover" | "inView" | "manual";

export interface GravityLettersProps {
  bounce?: number;
  className?: string;
  collapsed?: boolean;
  friction?: number;
  gravity?: number;
  onCollapsedChange?: (collapsed: boolean) => void;
  spread?: number;
  stagger?: number;
  text: string;
  trigger?: GravityLettersTrigger;
}

interface LetterOrigin {
  height: number;
  width: number;
  x: number;
  y: number;
}

interface LetterPhysics {
  angle: number;
  angularVel: number;
  dx: number;
  dy: number;
  releaseAt: number;
  settled: boolean;
  vx: number;
  vy: number;
}

type Phase = "falling" | "idle" | "reforming" | "settled";

const DEFAULT_GRAVITY = 1200;
const DEFAULT_BOUNCE = 0.35;
const DEFAULT_FRICTION = 0.4;
const DEFAULT_SPREAD = 140;
const DEFAULT_STAGGER = 40;
const MAX_DT_SECONDS = 0.05;
const REST_VELOCITY = 20;
const REST_HORIZONTAL_VELOCITY = 5;
const SPRING_STIFFNESS = 180;
const SPRING_DAMPING = 18;
const REFORM_EPSILON_POSITION = 0.5;
const REFORM_EPSILON_ANGLE = 0.5;
const REFORM_EPSILON_VELOCITY = 5;

const GravityLetters = ({
  bounce = DEFAULT_BOUNCE,
  className,
  collapsed: collapsedProp,
  friction = DEFAULT_FRICTION,
  gravity = DEFAULT_GRAVITY,
  onCollapsedChange,
  spread = DEFAULT_SPREAD,
  stagger = DEFAULT_STAGGER,
  text,
  trigger = "hover",
}: GravityLettersProps) => {
  const shouldReduceMotion = useReducedMotion();
  const letters = useMemo(() => Array.from(text), [text]);

  const isControlled = collapsedProp !== undefined;
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = isControlled ? Boolean(collapsedProp) : internalCollapsed;

  const onCollapsedChangeRef = useRef(onCollapsedChange);
  useEffect(() => {
    onCollapsedChangeRef.current = onCollapsedChange;
  });

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setInternalCollapsed(next);
      }
      onCollapsedChangeRef.current?.(next);
    },
    [isControlled]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const originsRef = useRef<LetterOrigin[]>([]);
  const physicsRef = useRef<LetterPhysics[]>([]);
  const phaseRef = useRef<Phase>("idle");
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const configRef = useRef({ bounce, friction, gravity, spread, stagger });

  useEffect(() => {
    configRef.current = { bounce, friction, gravity, spread, stagger };
  }, [bounce, friction, gravity, spread, stagger]);

  const applyIdleTransforms = useCallback(() => {
    for (let i = 0; i < letterRefs.current.length; i++) {
      const el = letterRefs.current[i];
      const origin = originsRef.current[i];
      if (el && origin) {
        el.style.transform = `translate3d(${origin.x}px, ${origin.y}px, 0) rotate(0deg)`;
      }
    }
  }, []);

  useLayoutEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const measure = () => {
      const containerRect = container.getBoundingClientRect();
      originsRef.current = measureRefs.current.map((el) => {
        if (!el) {
          return { height: 0, width: 0, x: 0, y: 0 };
        }
        const rect = el.getBoundingClientRect();
        return {
          height: rect.height,
          width: rect.width,
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
        };
      });

      if (phaseRef.current === "idle") {
        applyIdleTransforms();
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [letters, shouldReduceMotion, applyIdleTransforms]);

  const startLoop = useCallback(() => {
    if (rafRef.current !== null) {
      return;
    }

    lastTickRef.current = null;

    const tick = (now: number) => {
      const lastTick = lastTickRef.current ?? now;
      const dt = Math.min((now - lastTick) / 1000, MAX_DT_SECONDS);
      lastTickRef.current = now;

      const container = containerRef.current;
      if (!container) {
        rafRef.current = null;
        return;
      }

      const rect = container.getBoundingClientRect();
      const floorY = rect.height;
      const wallRight = rect.width;
      const { bounce: b, friction: f, gravity: g } = configRef.current;

      let stillActive = false;

      for (let i = 0; i < physicsRef.current.length; i++) {
        const p = physicsRef.current[i];
        const el = letterRefs.current[i];
        const origin = originsRef.current[i];
        if (!(p && el && origin)) {
          continue;
        }

        if (phaseRef.current === "falling") {
          if (now < p.releaseAt) {
            stillActive = true;
            continue;
          }
          if (p.settled) {
            continue;
          }
          stillActive = true;

          p.vy += g * dt;
          p.dx += p.vx * dt;
          p.dy += p.vy * dt;
          p.angle += p.angularVel * dt;

          const floorLimit = floorY - origin.y - origin.height;
          if (p.dy >= floorLimit) {
            p.dy = floorLimit;
            p.vy = -p.vy * b;
            p.vx *= 1 - f;
            p.angularVel *= 1 - f;
            if (
              Math.abs(p.vy) < REST_VELOCITY &&
              Math.abs(p.vx) < REST_HORIZONTAL_VELOCITY
            ) {
              p.vy = 0;
              p.vx = 0;
              p.angularVel = 0;
              p.settled = true;
            }
          }

          const leftLimit = -origin.x;
          const rightLimit = wallRight - origin.x - origin.width;
          if (p.dx <= leftLimit) {
            p.dx = leftLimit;
            p.vx = -p.vx * b;
          } else if (p.dx >= rightLimit) {
            p.dx = rightLimit;
            p.vx = -p.vx * b;
          }
        } else if (phaseRef.current === "reforming") {
          if (p.settled) {
            continue;
          }

          const ax = -SPRING_STIFFNESS * p.dx - SPRING_DAMPING * p.vx;
          const ay = -SPRING_STIFFNESS * p.dy - SPRING_DAMPING * p.vy;
          const aAngle =
            -SPRING_STIFFNESS * p.angle - SPRING_DAMPING * p.angularVel;

          p.vx += ax * dt;
          p.vy += ay * dt;
          p.angularVel += aAngle * dt;
          p.dx += p.vx * dt;
          p.dy += p.vy * dt;
          p.angle += p.angularVel * dt;

          if (
            Math.abs(p.dx) < REFORM_EPSILON_POSITION &&
            Math.abs(p.dy) < REFORM_EPSILON_POSITION &&
            Math.abs(p.angle) < REFORM_EPSILON_ANGLE &&
            Math.abs(p.vx) < REFORM_EPSILON_VELOCITY &&
            Math.abs(p.vy) < REFORM_EPSILON_VELOCITY
          ) {
            p.dx = 0;
            p.dy = 0;
            p.angle = 0;
            p.vx = 0;
            p.vy = 0;
            p.settled = true;
          } else {
            stillActive = true;
          }
        }

        el.style.transform = `translate3d(${origin.x + p.dx}px, ${
          origin.y + p.dy
        }px, 0) rotate(${p.angle}deg)`;
      }

      if (stillActive) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        phaseRef.current = phaseRef.current === "falling" ? "settled" : "idle";
        if (phaseRef.current === "idle") {
          applyIdleTransforms();
        }
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [applyIdleTransforms]);

  const startFalling = useCallback(() => {
    if (originsRef.current.length === 0) {
      return;
    }

    const now = performance.now();
    const { spread: s, stagger: st } = configRef.current;

    physicsRef.current = letters.map((_, index) => ({
      angle: 0,
      angularVel: (Math.random() * 2 - 1) * 180,
      dx: 0,
      dy: 0,
      releaseAt: now + index * st,
      settled: false,
      vx: (Math.random() * 2 - 1) * s,
      vy: 0,
    }));

    phaseRef.current = "falling";
    startLoop();
  }, [letters, startLoop]);

  const startReforming = useCallback(() => {
    if (physicsRef.current.length === 0) {
      return;
    }

    for (const p of physicsRef.current) {
      p.settled = false;
    }

    phaseRef.current = "reforming";
    startLoop();
  }, [startLoop]);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    if (collapsed) {
      startFalling();
    } else {
      startReforming();
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: startFalling/startReforming are stable via useCallback and read live refs
  }, [collapsed, shouldReduceMotion]);

  useEffect(
    () => () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (trigger !== "inView" || shouldReduceMotion) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCollapsed(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [trigger, shouldReduceMotion, setCollapsed]);

  const isInteractive = trigger === "hover" || trigger === "click";

  const handleMouseEnter = () => {
    if (trigger === "hover") {
      setCollapsed(true);
    }
  };
  const handleMouseLeave = () => {
    if (trigger === "hover") {
      setCollapsed(false);
    }
  };
  const handleFocus = () => {
    if (trigger === "hover") {
      setCollapsed(true);
    }
  };
  const handleBlur = () => {
    if (trigger === "hover") {
      setCollapsed(false);
    }
  };
  const handleClick = () => {
    if (trigger === "click") {
      setCollapsed(!collapsed);
    }
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (trigger === "click" && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      setCollapsed(!collapsed);
    }
  };

  if (shouldReduceMotion) {
    return (
      <div className={cn("relative", className)}>
        <span>{text}</span>
      </div>
    );
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover/click triggers are opt-in via the `trigger` prop and mirrored with keyboard handlers below
    <div
      className={cn(
        "relative isolate min-h-24 select-none overflow-hidden",
        className
      )}
      aria-pressed={trigger === "click" ? collapsed : undefined}
      onBlur={isInteractive ? handleBlur : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onFocus={isInteractive ? handleFocus : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      onMouseEnter={isInteractive ? handleMouseEnter : undefined}
      onMouseLeave={isInteractive ? handleMouseLeave : undefined}
      ref={containerRef}
      role={trigger === "click" ? "button" : undefined}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: interactive trigger modes need keyboard focus to fall/reform the text
      tabIndex={isInteractive ? 0 : undefined}
    >
      <span className="sr-only">{text}</span>

      <div
        aria-hidden="true"
        className="pointer-events-none invisible flex flex-wrap"
      >
        {letters.map((char, index) => (
          <span
            className="inline-block whitespace-pre"
            // biome-ignore lint/suspicious/noArrayIndexKey: characters have no stable id
            key={index}
            ref={(el) => {
              measureRefs.current[index] = el;
            }}
          >
            {char}
          </span>
        ))}
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {letters.map((char, index) => (
          <span
            className="absolute top-0 left-0 inline-block whitespace-pre will-change-transform"
            // biome-ignore lint/suspicious/noArrayIndexKey: characters have no stable id
            key={index}
            ref={(el) => {
              letterRefs.current[index] = el;
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default GravityLetters;
