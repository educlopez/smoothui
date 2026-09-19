"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

export type UnlockStatus = "idle" | "scanning" | "success" | "error";

export type UnlockFaceIdProps = {
  /** Content gated behind the scan — blurred while locked, sharp once unlocked */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Message shown when the status is `error` */
  errorMessage?: string;
  /** Accessible label for the scan trigger */
  label?: string;
  /** Fired when an uncontrolled scan resolves successfully */
  onComplete?: () => void;
  /** Fired whenever the trigger is activated */
  onScan?: () => void;
  /** How long an uncontrolled scan takes, in ms */
  scanDuration?: number;
  /** Rendered size of the glyph, in px */
  size?: number;
  /** Controlled status — omit for uncontrolled behaviour */
  status?: UnlockStatus;
};

const DEFAULT_SIZE = 128;
const DEFAULT_SCAN_DURATION = 1800;
const DEFAULT_ERROR_MESSAGE = "Face not recognized. Try again.";

/* -------------------------------------------------------------------------- */
/* Motion tokens                                                              */
/* -------------------------------------------------------------------------- */

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.645, 0.045, 0.355, 1];
const INSTANT = { duration: 0 };
const CHECK_SPRING = { bounce: 0.28, duration: 0.4, type: "spring" as const };
const GLYPH_SPRING = { bounce: 0.1, duration: 0.25, type: "spring" as const };
const BRACKET_DRAW = 0.4;
const BRACKET_STAGGER = 0.07;
const FACE_DELAY = 0.26;
const FACE_DRAW = 0.42;
const FACE_STAGGER = 0.07;
const SCAN_SWEEP = 1.5;
const SHAKE_DURATION = 0.4;
const CONTENT_REVEAL = 0.4;
const SHAKE_KEYFRAMES = [0, -7, 7, -5, 5, -2, 0];

/* -------------------------------------------------------------------------- */
/* Geometry — Apple's Face ID mark: four corner brackets + a schematic face    */
/* -------------------------------------------------------------------------- */

const VIEWBOX = 100;
const STROKE_WIDTH = 4;
const CHECK_STROKE_WIDTH = 5;

/** Four corner brackets only — no full outline — with a clear gap between them. */
const BRACKET_PATHS = [
  "M8 34 L8 28 A20 20 0 0 1 28 8 L34 8",
  "M66 8 L72 8 A20 20 0 0 1 92 28 L92 34",
  "M92 66 L92 72 A20 20 0 0 1 72 92 L66 92",
  "M34 92 L28 92 A20 20 0 0 1 8 72 L8 66",
];

/** Two short vertical eye strokes, a nose that turns right at the bottom, and a
 *  shallow smile with small upward ticks at each end. */
const FACE_PATHS = [
  "M36 38 L36 47",
  "M64 38 L64 47",
  "M50 38 L50 54 Q50 57.5 53.5 57.5 L56 57.5",
  "M36 61 L36 66 Q50 73 64 66 L64 61",
];

const CHECK_PATH = "M30 52 L44 66 L72 34";

const SCAN_CLIP = { height: 84, rx: 22, width: 84, x: 8, y: 8 };
const SCAN_BAND_HEIGHT = 18;
const SCAN_TRAVEL = 34;

const STATUS_MESSAGES: Record<Exclude<UnlockStatus, "error">, string> = {
  idle: "Ready to scan.",
  scanning: "Scanning face…",
  success: "Identity confirmed. Unlocked.",
};

const STROKE_BY_STATUS: Record<UnlockStatus, string> = {
  error: "var(--color-destructive, #ef4444)",
  idle: "currentColor",
  scanning: "currentColor",
  success: "var(--color-green, #22c55e)",
};

/* -------------------------------------------------------------------------- */
/* Glyph                                                                      */
/* -------------------------------------------------------------------------- */

type FaceGlyphProps = {
  canAnimate: boolean;
  clipId: string;
  gradientId: string;
  isScanning: boolean;
  stroke: string;
};

const FaceGlyph = ({
  canAnimate,
  clipId,
  gradientId,
  isScanning,
  stroke,
}: FaceGlyphProps) => (
  <motion.g
    animate={{ opacity: 1, scale: 1 }}
    exit={
      canAnimate
        ? { opacity: 0, scale: 0.82 }
        : { opacity: 0, transition: INSTANT }
    }
    initial={
      canAnimate ? { opacity: 0, scale: 0.94 } : { opacity: 1, scale: 1 }
    }
    style={{ transformOrigin: "50px 50px" }}
    transition={canAnimate ? GLYPH_SPRING : INSTANT}
  >
    {BRACKET_PATHS.map((path, index) => (
      <motion.path
        animate={{ pathLength: 1 }}
        d={path}
        fill="none"
        initial={canAnimate ? { pathLength: 0 } : { pathLength: 1 }}
        key={path}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={STROKE_WIDTH}
        transition={
          canAnimate
            ? {
                delay: index * BRACKET_STAGGER,
                duration: BRACKET_DRAW,
                ease: EASE_OUT,
              }
            : INSTANT
        }
      />
    ))}

    {FACE_PATHS.map((path, index) => (
      <motion.path
        animate={{ pathLength: 1 }}
        d={path}
        fill="none"
        initial={canAnimate ? { pathLength: 0 } : { pathLength: 1 }}
        key={path}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={STROKE_WIDTH}
        transition={
          canAnimate
            ? {
                delay: FACE_DELAY + index * FACE_STAGGER,
                duration: FACE_DRAW,
                ease: EASE_OUT,
              }
            : INSTANT
        }
      />
    ))}

    {isScanning && canAnimate ? (
      <g clipPath={`url(#${clipId})`}>
        <motion.g
          animate={{ y: SCAN_TRAVEL }}
          initial={{ y: -SCAN_TRAVEL }}
          transition={{
            duration: SCAN_SWEEP,
            ease: EASE_IN_OUT,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <rect
            fill={`url(#${gradientId})`}
            height={SCAN_BAND_HEIGHT}
            width={SCAN_CLIP.width}
            x={SCAN_CLIP.x}
            y={50 - SCAN_BAND_HEIGHT / 2}
          />
          <line
            opacity={0.9}
            stroke="var(--color-brand, #6366f1)"
            strokeLinecap="round"
            strokeWidth={1.5}
            x1={SCAN_CLIP.x + 2}
            x2={SCAN_CLIP.x + SCAN_CLIP.width - 2}
            y1={50 + SCAN_BAND_HEIGHT / 2}
            y2={50 + SCAN_BAND_HEIGHT / 2}
          />
        </motion.g>
      </g>
    ) : null}
  </motion.g>
);

type CheckGlyphProps = {
  canAnimate: boolean;
};

const CheckGlyph = ({ canAnimate }: CheckGlyphProps) => (
  <motion.g
    animate={{ opacity: 1, scale: 1 }}
    initial={canAnimate ? { opacity: 0, scale: 0.6 } : { opacity: 1, scale: 1 }}
    style={{ transformOrigin: "50px 50px" }}
    transition={canAnimate ? CHECK_SPRING : INSTANT}
  >
    <motion.path
      animate={{ pathLength: 1 }}
      d={CHECK_PATH}
      fill="none"
      initial={canAnimate ? { pathLength: 0 } : { pathLength: 1 }}
      stroke="var(--color-green, #22c55e)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={CHECK_STROKE_WIDTH}
      transition={canAnimate ? CHECK_SPRING : INSTANT}
    />
  </motion.g>
);

/* -------------------------------------------------------------------------- */
/* Root                                                                      */
/* -------------------------------------------------------------------------- */

const UnlockFaceId = ({
  children,
  className,
  errorMessage = DEFAULT_ERROR_MESSAGE,
  label = "Scan to unlock",
  onComplete,
  onScan,
  scanDuration = DEFAULT_SCAN_DURATION,
  size = DEFAULT_SIZE,
  status: controlledStatus,
}: UnlockFaceIdProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const canAnimate = !shouldReduceMotion;
  const isControlled = controlledStatus !== undefined;
  const [internalStatus, setInternalStatus] = useState<UnlockStatus>("idle");
  const status = isControlled ? controlledStatus : internalStatus;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactId = useId();
  const uid = reactId.replace(/:/g, "");
  const statusMessageId = `unlock-face-id-status-${uid}`;
  const clipId = `unlock-face-id-clip-${uid}`;
  const gradientId = `unlock-face-id-gradient-${uid}`;

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const beginScan = useCallback(() => {
    onScan?.();
    if (isControlled) {
      return;
    }
    setInternalStatus("scanning");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setInternalStatus("success");
      onComplete?.();
    }, scanDuration);
  }, [isControlled, onComplete, onScan, scanDuration]);

  const handleTriggerClick = useCallback(() => {
    if (status === "error") {
      onScan?.();
      if (!isControlled) {
        setInternalStatus("idle");
      }
      return;
    }
    if (status === "idle") {
      beginScan();
    }
  }, [beginScan, isControlled, onScan, status]);

  const isBusy = status === "scanning";
  const isUnlocked = status === "success";
  const statusMessage =
    status === "error" ? errorMessage : STATUS_MESSAGES[status];

  return (
    <div className={cn("flex w-full flex-col items-center gap-4", className)}>
      <button
        aria-busy={isBusy}
        aria-describedby={statusMessageId}
        aria-label={label}
        className="relative flex shrink-0 cursor-pointer items-center justify-center rounded-3xl text-foreground outline-none transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background active:scale-95 disabled:cursor-default disabled:active:scale-100 motion-reduce:transition-none motion-reduce:active:scale-100"
        disabled={isBusy || isUnlocked}
        onClick={handleTriggerClick}
        style={{ height: size, width: size }}
        type="button"
      >
        <motion.svg
          animate={{
            x: status === "error" && canAnimate ? SHAKE_KEYFRAMES : 0,
          }}
          aria-hidden="true"
          className="h-full w-full overflow-visible"
          transition={
            canAnimate
              ? { duration: SHAKE_DURATION, ease: EASE_IN_OUT }
              : INSTANT
          }
          viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        >
          <defs>
            <clipPath id={clipId}>
              <rect
                height={SCAN_CLIP.height}
                rx={SCAN_CLIP.rx}
                width={SCAN_CLIP.width}
                x={SCAN_CLIP.x}
                y={SCAN_CLIP.y}
              />
            </clipPath>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-brand, #6366f1)"
                stopOpacity={0}
              />
              <stop
                offset="100%"
                stopColor="var(--color-brand, #6366f1)"
                stopOpacity={0.45}
              />
            </linearGradient>
          </defs>

          <AnimatePresence mode="wait">
            {isUnlocked ? (
              <CheckGlyph canAnimate={canAnimate} key="check" />
            ) : (
              <FaceGlyph
                canAnimate={canAnimate}
                clipId={clipId}
                gradientId={gradientId}
                isScanning={isBusy}
                key="face"
                stroke={STROKE_BY_STATUS[status]}
              />
            )}
          </AnimatePresence>
        </motion.svg>
      </button>

      <p
        aria-live="polite"
        className={cn(
          "text-center font-medium text-sm transition-colors duration-200",
          status === "error" && "text-destructive",
          status === "success" && "text-green",
          (status === "idle" || status === "scanning") &&
            "text-muted-foreground"
        )}
        id={statusMessageId}
        role="status"
      >
        {statusMessage}
      </p>

      {children ? (
        <motion.div
          animate={{
            filter: isUnlocked ? "blur(0px)" : "blur(9px)",
            opacity: isUnlocked ? 1 : 0.5,
          }}
          className={cn("w-full", isUnlocked ? "" : "pointer-events-none")}
          initial={false}
          transition={
            canAnimate ? { duration: CONTENT_REVEAL, ease: EASE_OUT } : INSTANT
          }
        >
          {children}
        </motion.div>
      ) : null}
    </div>
  );
};

export default UnlockFaceId;
