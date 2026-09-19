"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactElement } from "react";

/* -------------------------------------------------------------------------- */
/* Public types                                                               */
/* -------------------------------------------------------------------------- */

export const MOTION_LOADER_VARIANTS = [
  "orbit",
  "newton-cradle",
  "pendulum",
  "hourglass",
  "morph-ring",
  "square-snake",
  "comet",
  "radar",
  "cube-flip",
  "wave-bars",
  "breathing-glow",
  "dot-ring",
] as const;

export type MotionLoaderVariant = (typeof MOTION_LOADER_VARIANTS)[number];

export interface MotionLoaderProps {
  className?: string;
  /** Any CSS colour. Defaults to `currentColor`, so it inherits text colour. */
  color?: string;
  /** Accessible label announced by screen readers. */
  label?: string;
  /** Square size in pixels. Every variant scales from this value. */
  size?: number;
  /** Animation speed multiplier. `2` runs twice as fast. */
  speed?: number;
  variant?: MotionLoaderVariant;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_SIZE = 40;
const DEFAULT_SPEED = 1;
const DEFAULT_LABEL = "Loading";
const DEFAULT_VARIANT: MotionLoaderVariant = "orbit";

const LINEAR: [number, number, number, number] = [0, 0, 1, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.645, 0.045, 0.355, 1];
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const CYCLE = 1.1;
const SLOW_CYCLE = 1.4;
const FULL_TURN = 360;
const HALF_TURN = 180;

const DOT_RATIO = 0.2;
const SMALL_DOT_RATIO = 0.14;
const TRACK_OPACITY = 0.2;
const TRAIL_LENGTH = 4;
const TRAIL_STEP_DEG = 16;
const CRADLE_BALLS = 5;
const CRADLE_SWING_DEG = 34;
const PENDULUM_SWING_DEG = 32;
const WAVE_BARS = 5;
const WAVE_MIN_SCALE = 0.3;
const WAVE_STAGGER = 0.1;
const RING_DOTS = 8;
const RING_DOT_FADE = 0.15;
const RING_STAGGER = 0.09;
const SNAKE_CELL_RATIO = 0.38;
const SNAKE_CORNERS = 4;
const GLOW_SCALE = 1.25;
const GLOW_MIN_OPACITY = 0.45;
const HALF = 0.5;

const loop = (duration: number, ease: [number, number, number, number]) => ({
  duration,
  ease,
  repeat: Number.POSITIVE_INFINITY,
  repeatType: "loop" as const,
});

const delayedLoop = (
  duration: number,
  ease: [number, number, number, number],
  delay: number
) => ({ ...loop(duration, ease), delay });

interface LoaderVariantProps {
  reduce: boolean;
  size: number;
  speed: number;
}

const dotStyle = (diameter: number): CSSProperties => ({
  height: `${diameter}px`,
  width: `${diameter}px`,
});

/** Stable React keys for the fixed-length element lists of each variant. */
const idList = (prefix: string, count: number): string[] =>
  Array.from({ length: count }, (_, index) => `${prefix}-${index}`);

const CRADLE_IDS = idList("cradle", CRADLE_BALLS);
const SNAKE_IDS = idList("snake", SNAKE_CORNERS);
const COMET_IDS = idList("comet", TRAIL_LENGTH);
const WAVE_IDS = idList("wave", WAVE_BARS);
const RING_IDS = idList("ring", RING_DOTS);

/* -------------------------------------------------------------------------- */
/* Variants                                                                   */
/* -------------------------------------------------------------------------- */

const OrbitLoader = ({ reduce, size, speed }: LoaderVariantProps) => {
  const dot = size * DOT_RATIO;
  return (
    <>
      <span
        className="absolute inset-0 rounded-full border border-current"
        style={{ opacity: TRACK_OPACITY }}
      />
      <motion.span
        animate={reduce ? undefined : { rotate: FULL_TURN }}
        className="absolute inset-0"
        transition={reduce ? undefined : loop(CYCLE / speed, LINEAR)}
      >
        <span
          className="absolute top-0 left-1/2 rounded-full bg-current"
          style={{
            ...dotStyle(dot),
            marginLeft: -dot * HALF,
            marginTop: -dot * HALF,
          }}
        />
      </motion.span>
    </>
  );
};

const CRADLE_TIMES = [0, 0.25, 0.5, 0.75, 1];

const cradleKeyframes = (index: number): number[] | undefined => {
  if (index === 0) {
    return [0, -CRADLE_SWING_DEG, 0, 0, 0];
  }
  if (index === CRADLE_BALLS - 1) {
    return [0, 0, 0, CRADLE_SWING_DEG, 0];
  }
};

const NewtonCradleLoader = ({ reduce, size, speed }: LoaderVariantProps) => {
  const ball = size / CRADLE_BALLS;
  return (
    <span className="absolute inset-0 flex items-start justify-center">
      {CRADLE_IDS.map((id, index) => {
        const keyframes = cradleKeyframes(index);
        return (
          <motion.span
            animate={reduce || !keyframes ? undefined : { rotate: keyframes }}
            className="relative block"
            key={id}
            style={{
              height: `${size}px`,
              transformOrigin: "top center",
              width: `${ball}px`,
            }}
            transition={
              reduce || !keyframes
                ? undefined
                : {
                    ...loop(SLOW_CYCLE / speed, EASE_IN_OUT),
                    times: CRADLE_TIMES,
                  }
            }
          >
            <span
              className="absolute top-0 bottom-0 left-1/2 w-px bg-current"
              style={{ opacity: TRACK_OPACITY }}
            />
            <span
              className="absolute bottom-0 left-1/2 rounded-full bg-current"
              style={{ ...dotStyle(ball), marginLeft: -ball * HALF }}
            />
          </motion.span>
        );
      })}
    </span>
  );
};

const PendulumLoader = ({ reduce, size, speed }: LoaderVariantProps) => {
  const bob = size * DOT_RATIO * 1.5;
  return (
    <motion.span
      animate={
        reduce
          ? undefined
          : {
              rotate: [
                -PENDULUM_SWING_DEG,
                PENDULUM_SWING_DEG,
                -PENDULUM_SWING_DEG,
              ],
            }
      }
      className="absolute inset-0"
      style={{ transformOrigin: "top center" }}
      transition={reduce ? undefined : loop(SLOW_CYCLE / speed, EASE_IN_OUT)}
    >
      <span
        className="absolute top-0 bottom-2 left-1/2 w-px bg-current"
        style={{ opacity: TRACK_OPACITY }}
      />
      <span
        className="absolute bottom-0 left-1/2 rounded-full bg-current"
        style={{ ...dotStyle(bob), marginLeft: -bob * HALF }}
      />
    </motion.span>
  );
};

const HourglassLoader = ({ reduce, size, speed }: LoaderVariantProps) => (
  <motion.svg
    animate={
      reduce ? undefined : { rotate: [0, 0, HALF_TURN, HALF_TURN, FULL_TURN] }
    }
    className="absolute inset-0 fill-current"
    height={size}
    transition={
      reduce
        ? undefined
        : {
            ...loop(SLOW_CYCLE / speed, EASE_IN_OUT),
            times: [0, 0.3, 0.5, 0.8, 1],
          }
    }
    viewBox="0 0 24 24"
    width={size}
  >
    <path d="M5 2h14v2l-6 8 6 8v2H5v-2l6-8-6-8V2z" opacity={TRACK_OPACITY} />
    <path d="M7 4h10l-5 6.5L7 4zm0 16h10l-5-6.5L7 20z" />
  </motion.svg>
);

const MorphRingLoader = ({ reduce, size, speed }: LoaderVariantProps) => (
  <motion.svg
    animate={reduce ? undefined : { scale: [1, 0.88, 1] }}
    className="absolute inset-0 stroke-current"
    fill="none"
    height={size}
    transition={reduce ? undefined : loop(CYCLE / speed, EASE_IN_OUT)}
    viewBox="0 0 48 48"
    width={size}
  >
    <motion.circle
      animate={reduce ? undefined : { rotate: FULL_TURN }}
      cx="24"
      cy="24"
      r="20"
      strokeDasharray="62 64"
      strokeLinecap="round"
      strokeWidth="4"
      style={{ transformOrigin: "center" }}
      transition={reduce ? undefined : loop(CYCLE / speed, LINEAR)}
    />
    <motion.circle
      animate={reduce ? undefined : { rotate: -FULL_TURN }}
      cx="24"
      cy="24"
      opacity={0.45}
      r="11"
      strokeDasharray="24 45"
      strokeLinecap="round"
      strokeWidth="4"
      style={{ transformOrigin: "center" }}
      transition={reduce ? undefined : loop((CYCLE * 1.5) / speed, LINEAR)}
    />
  </motion.svg>
);

const SquareSnakeLoader = ({ reduce, size, speed }: LoaderVariantProps) => {
  const cell = size * SNAKE_CELL_RATIO;
  const travel = size - cell;
  const positions: CSSProperties[] = [
    { left: 0, top: 0 },
    { left: travel, top: 0 },
    { left: travel, top: travel },
    { left: 0, top: travel },
  ];
  return (
    <>
      {SNAKE_IDS.map((id, index) => (
        <span
          className="absolute rounded-sm bg-current"
          key={id}
          style={{
            ...positions[index],
            ...dotStyle(cell),
            opacity: TRACK_OPACITY,
          }}
        />
      ))}
      <motion.span
        animate={
          reduce
            ? undefined
            : { x: [0, travel, travel, 0, 0], y: [0, 0, travel, travel, 0] }
        }
        className="absolute top-0 left-0 rounded-sm bg-current"
        style={dotStyle(cell)}
        transition={
          reduce
            ? undefined
            : {
                ...loop(SLOW_CYCLE / speed, EASE_IN_OUT),
                times: [0, 0.25, 0.5, 0.75, 1],
              }
        }
      />
    </>
  );
};

const CometLoader = ({ reduce, size, speed }: LoaderVariantProps) => {
  const dot = size * SMALL_DOT_RATIO;
  return (
    <motion.span
      animate={reduce ? undefined : { rotate: FULL_TURN }}
      className="absolute inset-0"
      transition={reduce ? undefined : loop(CYCLE / speed, LINEAR)}
    >
      {COMET_IDS.map((id, index) => (
        <span
          className="absolute inset-0"
          key={id}
          style={{ transform: `rotate(${-index * TRAIL_STEP_DEG}deg)` }}
        >
          <span
            className="absolute top-0 left-1/2 rounded-full bg-current"
            style={{
              ...dotStyle(dot * (1 - index / (TRAIL_LENGTH * 2))),
              marginLeft: -dot * HALF,
              opacity: 1 - index / TRAIL_LENGTH,
            }}
          />
        </span>
      ))}
    </motion.span>
  );
};

const RadarLoader = ({ reduce, size, speed }: LoaderVariantProps) => {
  const dot = size * SMALL_DOT_RATIO;
  return (
    <>
      <span
        className="absolute inset-0 rounded-full border border-current"
        style={{ opacity: TRACK_OPACITY }}
      />
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <motion.span
          animate={reduce ? undefined : { rotate: FULL_TURN }}
          className="absolute inset-0"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, transparent 260deg, currentColor 360deg)",
          }}
          transition={reduce ? undefined : loop(CYCLE / speed, LINEAR)}
        />
      </span>
      <span
        className="absolute top-1/2 left-1/2 rounded-full bg-current"
        style={{
          ...dotStyle(dot),
          marginLeft: -dot * HALF,
          marginTop: -dot * HALF,
        }}
      />
    </>
  );
};

const CubeFlipLoader = ({ reduce, size, speed }: LoaderVariantProps) => (
  <span className="absolute inset-0" style={{ perspective: `${size * 3}px` }}>
    <motion.span
      animate={
        reduce
          ? undefined
          : {
              rotateX: [0, HALF_TURN, HALF_TURN, FULL_TURN],
              rotateY: [0, 0, HALF_TURN, HALF_TURN],
            }
      }
      className="absolute inset-0 rounded-md bg-current"
      transition={
        reduce
          ? undefined
          : {
              ...loop((SLOW_CYCLE * 1.5) / speed, EASE_IN_OUT),
              times: [0, 0.33, 0.66, 1],
            }
      }
    />
  </span>
);

const WaveBarsLoader = ({ reduce, size, speed }: LoaderVariantProps) => {
  const barWidth = size / (WAVE_BARS * 2);
  return (
    <span
      className="absolute inset-0 flex items-center justify-between"
      style={{ gap: `${barWidth * HALF}px` }}
    >
      {WAVE_IDS.map((id, index) => (
        <motion.span
          animate={
            reduce ? undefined : { scaleY: [WAVE_MIN_SCALE, 1, WAVE_MIN_SCALE] }
          }
          className="flex-1 rounded-full bg-current"
          key={id}
          style={{
            height: `${size}px`,
            scaleY: reduce ? WAVE_MIN_SCALE + index * WAVE_STAGGER : undefined,
          }}
          transition={
            reduce
              ? undefined
              : delayedLoop(CYCLE / speed, EASE_IN_OUT, index * WAVE_STAGGER)
          }
        />
      ))}
    </span>
  );
};

const BreathingGlowLoader = ({ reduce, size, speed }: LoaderVariantProps) => {
  const core = size * HALF;
  return (
    <>
      <motion.span
        animate={
          reduce
            ? undefined
            : {
                opacity: [GLOW_MIN_OPACITY, 0, GLOW_MIN_OPACITY],
                scale: [1, GLOW_SCALE, 1],
              }
        }
        className="absolute inset-0 rounded-full bg-current blur-md"
        style={{ opacity: GLOW_MIN_OPACITY }}
        transition={reduce ? undefined : loop(SLOW_CYCLE / speed, EASE_IN_OUT)}
      />
      <motion.span
        animate={reduce ? undefined : { scale: [1, GLOW_SCALE, 1] }}
        className="rounded-full bg-current"
        style={dotStyle(core)}
        transition={reduce ? undefined : loop(SLOW_CYCLE / speed, EASE_OUT)}
      />
    </>
  );
};

const DotRingLoader = ({ reduce, size, speed }: LoaderVariantProps) => {
  const dot = size * SMALL_DOT_RATIO;
  const radius = size * HALF - dot * HALF;
  return (
    <>
      {RING_IDS.map((id, index) => (
        <motion.span
          animate={reduce ? undefined : { opacity: [1, RING_DOT_FADE] }}
          className="absolute top-1/2 left-1/2 rounded-full bg-current"
          key={id}
          style={{
            ...dotStyle(dot),
            marginLeft: -dot * HALF,
            marginTop: -dot * HALF,
            opacity: reduce ? 1 - index * RING_DOT_FADE * HALF : undefined,
            transform: `rotate(${(index * FULL_TURN) / RING_DOTS}deg) translateY(${-radius}px)`,
          }}
          transition={
            reduce
              ? undefined
              : delayedLoop(CYCLE / speed, LINEAR, index * RING_STAGGER)
          }
        />
      ))}
    </>
  );
};

const VARIANT_RENDERERS: Record<
  MotionLoaderVariant,
  (props: LoaderVariantProps) => ReactElement
> = {
  "breathing-glow": BreathingGlowLoader,
  comet: CometLoader,
  "cube-flip": CubeFlipLoader,
  "dot-ring": DotRingLoader,
  hourglass: HourglassLoader,
  "morph-ring": MorphRingLoader,
  "newton-cradle": NewtonCradleLoader,
  orbit: OrbitLoader,
  pendulum: PendulumLoader,
  radar: RadarLoader,
  "square-snake": SquareSnakeLoader,
  "wave-bars": WaveBarsLoader,
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

const MotionLoader = ({
  className,
  color,
  label = DEFAULT_LABEL,
  size = DEFAULT_SIZE,
  speed = DEFAULT_SPEED,
  variant = DEFAULT_VARIANT,
}: MotionLoaderProps) => {
  const shouldReduceMotion = useReducedMotion();
  const Renderer = VARIANT_RENDERERS[variant] ?? VARIANT_RENDERERS.orbit;
  const safeSpeed = speed > 0 ? speed : DEFAULT_SPEED;

  return (
    <span
      aria-label={label}
      aria-live="polite"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        className
      )}
      role="status"
      style={{
        color: color ?? "currentColor",
        height: `${size}px`,
        width: `${size}px`,
      }}
    >
      <Renderer
        reduce={Boolean(shouldReduceMotion)}
        size={size}
        speed={safeSpeed}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default MotionLoader;
