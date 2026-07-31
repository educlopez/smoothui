"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import {
  motion,
  useAnimationControls,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useCallback, useEffect, useId, useRef } from "react";
import {
  type AIAmplitude,
  type AIState,
  getAIStateMotion,
  useAmplitudeValue,
} from "../ai-core";

const VIEWBOX = 100;
const CENTER = VIEWBOX / 2;
const EYE_OFFSET = 16;
const EYE_Y = 44;
const EYE_WIDTH = 11;
const EYE_HEIGHT = 26;
const EYE_RADIUS = 5.5;
/** How far the pupils can travel from centre, in viewBox units. */
const GAZE_RANGE = 5.5;
/** Cursor distance, in px, at which the gaze reaches full deflection. */
const GAZE_FALLOFF = 220;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN = [0.4, 0, 1, 1] as const;
/** A ~1.25-turn swirl; spun in place it reads as dizzy. */
const SPIRAL = "M0 0C-0.6 -4 5 -5 6 -0.6C7 4.5 1 8 -4 6C-9 4.5 -9.5 -2 -6 -6";
const BLINK_MIN_MS = 3200;
const BLINK_EXTRA_MS = 2600;
const DOUBLE_BLINK_CHANCE = 0.25;
/** Thinking saccades: the eyes look away and up, the way people search. */
const SACCADE_MIN_MS = 700;
const SACCADE_EXTRA_MS = 700;
const SACCADE_TARGETS = [
  { x: -1, y: -1 },
  { x: 1, y: -1 },
  { x: -0.6, y: -0.4 },
  { x: 0.8, y: -0.9 },
] as const;

export type AIOrbFaceProps = {
  /** Accessible label. Omit to keep the character decorative. */
  "aria-label"?: string;
  /** Live audio level, 0–1. Widens the eyes and lifts the body while speaking. */
  amplitude?: AIAmplitude;
  className?: string;
  colors?: { body?: string; bodyEdge?: string; feature?: string };
  /**
   * Follow the pointer with its gaze. Turn off inside dense UI where a dozen
   * of these tracking the cursor would be noise.
   */
  gaze?: boolean;
  /** Rendered size. Numbers are pixels. */
  size?: number | string;
  state?: AIState;
};

const DEFAULT_COLORS = {
  body: "oklch(78% 0.14 280)",
  bodyEdge: "oklch(70% 0.16 320)",
  feature: "oklch(24% 0.03 280)",
};

/**
 * A little character rather than an indicator.
 *
 * Status is carried by expression — the thing humans read fastest and the reason
 * a literal checkmark stuck onto an orb feels wrong. Squints while it thinks,
 * eyes wide while it listens, happy arcs when it finishes, spiral-eyed when it
 * breaks. The gaze and blink cadence are borrowed from the SmoothUI moai so the
 * two feel like the same creature.
 */
const AIOrbFace = ({
  "aria-label": ariaLabel,
  amplitude,
  className,
  colors,
  gaze = true,
  size = 128,
  state = "idle",
}: AIOrbFaceProps) => {
  const shouldReduceMotion = useReducedMotion();
  const amplitudeValue = useAmplitudeValue(amplitude);
  const stateMotion = getAIStateMotion(state);
  const finalColors = { ...DEFAULT_COLORS, ...colors };

  // Gradient ids must be unique per instance, or a second face on the page
  // silently repaints the first one's body.
  const bodyGradientId = `${useId()}-body`;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const leftLid = useAnimationControls();
  const rightLid = useAnimationControls();
  const bodyControls = useAnimationControls();

  const gazeX = useSpring(0, { damping: 26, stiffness: 220 });
  const gazeY = useSpring(0, { damping: 26, stiffness: 220 });

  const resolvedSize = typeof size === "number" ? `${size}px` : size;

  const isHappy = state === "done";
  const isThinking = state === "thinking";
  const isListening = state === "listening";
  const isBroken = state === "error";
  const eyesOpen = !(isHappy || isBroken);

  // How open the eyes rest for this state.
  //
  // This drives the rect's `height`, never its `scaleY`. The blink owns scaleY
  // outright — when both the squint and the blink wrote to scaleY they fought,
  // and the eyes ended up stuck at whichever animation finished last.
  const openScale = (() => {
    if (isListening) {
      return 1.15;
    }
    if (isThinking) {
      return 0.62;
    }
    if (state === "streaming") {
      return 0.88;
    }
    return 1;
  })();

  // A blink spans several awaits, so the component can unmount mid-blink — a
  // route change, a state that hides the eyes. Animation controls throw if they
  // are driven after unmount, so every leg checks first.
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Snap shut, ease back open — an even-timed blink reads as a machine.
  const blink = useCallback(
    async (double = false) => {
      const closeT = { duration: 0.07, ease: EASE_IN };
      const openT = { duration: 0.16, ease: EASE_OUT };
      if (!mountedRef.current) {
        return;
      }
      await Promise.all([
        leftLid.start({ scaleY: 0.08 }, closeT),
        rightLid.start({ scaleY: 0.08 }, closeT),
      ]);
      if (!mountedRef.current) {
        return;
      }
      await Promise.all([
        leftLid.start({ scaleY: 1 }, double ? closeT : openT),
        rightLid.start({ scaleY: 1 }, double ? closeT : openT),
      ]);
      if (double) {
        await blink(false);
      }
    },
    [leftLid, rightLid]
  );

  // Idle blinking, occasionally a double.
  useEffect(() => {
    if (shouldReduceMotion || !eyesOpen) {
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    let mounted = true;
    const schedule = () => {
      timeout = setTimeout(
        () => {
          if (mounted) {
            blink(Math.random() < DOUBLE_BLINK_CHANCE);
          }
          schedule();
        },
        BLINK_MIN_MS + Math.random() * BLINK_EXTRA_MS
      );
    };
    schedule();
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [blink, eyesOpen, shouldReduceMotion]);

  // Gaze follows the pointer, except while thinking — then it looks away, which
  // is exactly what makes "thinking" legible without any added graphic.
  useEffect(() => {
    if (!gaze || shouldReduceMotion || isThinking || !eyesOpen) {
      return;
    }
    const handle = (event: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) {
        return;
      }
      const rect = svg.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const reach = Math.min(1, distance / GAZE_FALLOFF) * GAZE_RANGE;
      const angle = Math.atan2(dy, dx);
      gazeX.set(Math.cos(angle) * reach);
      gazeY.set(Math.sin(angle) * reach);
    };
    window.addEventListener("pointermove", handle);
    return () => window.removeEventListener("pointermove", handle);
  }, [gaze, gazeX, gazeY, isThinking, eyesOpen, shouldReduceMotion]);

  // Thinking saccades.
  useEffect(() => {
    if (!isThinking || shouldReduceMotion) {
      return;
    }
    let timeout: ReturnType<typeof setTimeout>;
    let mounted = true;
    let index = 0;
    const schedule = () => {
      timeout = setTimeout(
        () => {
          if (!mounted) {
            return;
          }
          const target = SACCADE_TARGETS[index % SACCADE_TARGETS.length];
          index += 1;
          gazeX.set(target.x * GAZE_RANGE);
          gazeY.set(target.y * GAZE_RANGE);
          schedule();
        },
        SACCADE_MIN_MS + Math.random() * SACCADE_EXTRA_MS
      );
    };
    schedule();
    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [gazeX, gazeY, isThinking, shouldReduceMotion]);

  // Error: one dizzy wobble.
  useEffect(() => {
    if (!isBroken) {
      return;
    }
    gazeX.set(0);
    gazeY.set(0);
    if (shouldReduceMotion) {
      return;
    }
    // The wobble plays once, but the spiral eyes stay for as long as the state
    // is `error`. Recovering to a neutral face after a couple of seconds would
    // leave a broken assistant looking fine.
    bodyControls.start(
      { rotate: [0, -11, 9, -7, 5, -3, 0], x: [0, -5, 4, -3, 2, -1, 0] },
      { duration: 1.05, ease: [0.45, 0, 0.55, 1] }
    );
  }, [bodyControls, gazeX, gazeY, isBroken, shouldReduceMotion]);

  // Done: a happy hop. The squash-and-stretch is the whole payload.
  useEffect(() => {
    if (!isHappy || shouldReduceMotion) {
      return;
    }
    bodyControls.start(
      {
        scaleX: [1, 1.08, 0.94, 1.04, 0.99, 1],
        scaleY: [1, 0.9, 1.08, 0.95, 1.02, 1],
        y: [0, 3, -9, 0, -3, 0],
      },
      { duration: 0.85, ease: EASE_OUT, times: [0, 0.12, 0.4, 0.62, 0.82, 1] }
    );
  }, [bodyControls, isHappy, shouldReduceMotion]);

  // Listening: the body breathes with the voice. Driven from the MotionValue so
  // a 60fps audio signal never re-renders this component.
  useEffect(() => {
    if (shouldReduceMotion || !isListening) {
      return;
    }
    const unsubscribe = amplitudeValue.on("change", (level) => {
      bodyControls.set({ scale: 1 + level * 0.07, y: -level * 2 });
    });
    return unsubscribe;
  }, [amplitudeValue, bodyControls, isListening, shouldReduceMotion]);

  // Reset the breathing here rather than in the effect above. Animation
  // controls reject `set()` after unmount, and an unsubscribe cleanup is
  // exactly when the component may already be gone.
  useEffect(() => {
    if (!(isListening || !mountedRef.current)) {
      bodyControls.set({ scale: 1, y: 0 });
    }
  }, [bodyControls, isListening]);

  const renderEye = (side: -1 | 1) => {
    const x = CENTER + side * EYE_OFFSET - EYE_WIDTH / 2;
    const controls = side === -1 ? leftLid : rightLid;
    const height = EYE_HEIGHT * openScale;
    // Keep the eye centred as it opens and closes, so a squint reads as lids
    // meeting rather than the eye sliding up the face.
    const y = EYE_Y + (EYE_HEIGHT - height) / 2;

    return (
      <motion.rect
        animate={controls}
        fill={finalColors.feature}
        height={height}
        initial={{ scaleY: 1 }}
        rx={Math.min(EYE_RADIUS, height / 2)}
        style={{
          transformOrigin: `${x + EYE_WIDTH / 2}px ${y + height / 2}px`,
          x: gazeX,
          y: gazeY,
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { bounce: 0.1, duration: 0.25, type: "spring" }
        }
        width={EYE_WIDTH}
        x={x}
        y={y}
      />
    );
  };

  const renderHappyEye = (side: -1 | 1) => {
    const cx = CENTER + side * EYE_OFFSET;
    const y = EYE_Y + EYE_HEIGHT / 2;
    return (
      <motion.path
        animate={{ pathLength: 1 }}
        d={`M${cx - 8} ${y + 3} Q${cx} ${y - 11} ${cx + 8} ${y + 3}`}
        fill="none"
        initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
        stroke={finalColors.feature}
        strokeLinecap="round"
        strokeWidth={7}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { delay: side === -1 ? 0 : 0.06, duration: 0.3, ease: EASE_OUT }
        }
      />
    );
  };

  const renderDizzyEye = (side: -1 | 1) => (
    <motion.path
      animate={shouldReduceMotion ? undefined : { rotate: 360 * side }}
      d={SPIRAL}
      fill="none"
      stroke={finalColors.feature}
      strokeLinecap="round"
      strokeWidth={3}
      style={{
        scale: 1.5,
        x: CENTER + side * EYE_OFFSET,
        y: EYE_Y + EYE_HEIGHT / 2,
      }}
      transition={{
        duration: 2.4,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      }}
    />
  );

  const renderMouth = () => {
    if (isHappy) {
      return (
        <motion.path
          animate={{ pathLength: 1 }}
          d={`M${CENTER - 11} 76 Q${CENTER} 88 ${CENTER + 11} 76`}
          fill="none"
          initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
          stroke={finalColors.feature}
          strokeLinecap="round"
          strokeWidth={5}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.32, ease: EASE_OUT }
          }
        />
      );
    }
    if (isBroken) {
      // A woozy wave, not a frown — it is confused, not scolding the user.
      return (
        <path
          d={`M${CENTER - 12} 79 q6 -7 12 0 t12 0`}
          fill="none"
          stroke={finalColors.feature}
          strokeLinecap="round"
          strokeWidth={4}
        />
      );
    }
    if (isThinking) {
      // Off-centre line: the universal "hmm".
      return (
        <motion.line
          animate={{ x: [0, 3, 0] }}
          stroke={finalColors.feature}
          strokeLinecap="round"
          strokeWidth={4}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  duration: 2.4,
                  ease: EASE_OUT,
                  repeat: Number.POSITIVE_INFINITY,
                }
          }
          x1={CENTER - 6}
          x2={CENTER + 8}
          y1={78}
          y2={78}
        />
      );
    }
    return (
      <line
        stroke={finalColors.feature}
        strokeLinecap="round"
        strokeWidth={4}
        x1={CENTER - 7}
        x2={CENTER + 7}
        y1={78}
        y2={78}
      />
    );
  };

  return (
    <motion.svg
      animate={bodyControls}
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn("block overflow-visible", className)}
      ref={svgRef}
      role={ariaLabel ? "img" : undefined}
      style={{
        filter: `saturate(${stateMotion.saturation})`,
        height: resolvedSize,
        width: resolvedSize,
      }}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
    >
      <title>{ariaLabel ?? "AI assistant character"}</title>
      <defs>
        <radialGradient cx="35%" cy="28%" id={bodyGradientId} r="80%">
          <stop offset="0%" stopColor={finalColors.body} />
          <stop offset="100%" stopColor={finalColors.bodyEdge} />
        </radialGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} fill={`url(#${bodyGradientId})`} r={48} />
      {/* One highlight is enough to make it a body rather than a flat disc. */}
      <ellipse
        cx={CENTER - 14}
        cy={CENTER - 22}
        fill="rgb(255 255 255 / 0.4)"
        rx={13}
        ry={8}
      />

      {eyesOpen && renderEye(-1)}
      {eyesOpen && renderEye(1)}
      {isHappy && renderHappyEye(-1)}
      {isHappy && renderHappyEye(1)}
      {isBroken && renderDizzyEye(-1)}
      {isBroken && renderDizzyEye(1)}
      {renderMouth()}
    </motion.svg>
  );
};

export default AIOrbFace;
