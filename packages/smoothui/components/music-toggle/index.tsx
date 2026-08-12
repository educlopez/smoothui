"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { Pause, Play } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

const DEFAULT_SIZE = 96;
const DEFAULT_BARS = 24;
const RING_RADIUS = 46;
const RING_VIEWBOX = 100;
const RING_STROKE_WIDTH = 4;
const ROTATION_DEG_PER_MS = 360 / 15_000;
const SEEK_STEP = 0.05;
const BAR_MIN_SCALE = 0.2;
const BAR_MAX_SCALE = 1;
const BAR_BASE_DURATION = 0.6;
const BAR_DURATION_JITTER = 0.5;
const HASH_MULTIPLIER = 12.9898;
const HASH_SCALE = 43_758.5453;
const SPRING = { bounce: 0.1, duration: 0.25, type: "spring" as const };
const MOVEMENT_EASE: [number, number, number, number] = [
  0.645, 0.045, 0.355, 1,
];

export type MusicToggleProps = {
  /** Number of waveform bars rendered next to the track info */
  bars?: number;
  /** Additional CSS classes */
  className?: string;
  /** Cover art image url shown inside the spinning record */
  cover?: string;
  /** Default playing state for uncontrolled usage */
  defaultPlaying?: boolean;
  /** Called when the seek slider is used to change progress */
  onSeek?: (progress: number) => void;
  /** Called whenever the playing state changes */
  onPlayingChange?: (playing: boolean) => void;
  /** Controlled playing state */
  playing?: boolean;
  /** Current playback progress, from 0 to 1 */
  progress?: number;
  /** Diameter of the record, in pixels */
  size?: number;
  /**
   * Audio source. When provided the component owns an `<audio>` element and
   * plays/pauses it. When omitted the component is purely visual and the
   * caller drives `playing` externally.
   */
  src?: string;
  /** Track artist, shown under the title */
  artist?: string;
  /** Track title, shown above the artist and read by assistive tech */
  title?: string;
};

const hashUnit = (seed: number) => {
  const x = Math.sin(seed * HASH_MULTIPLIER) * HASH_SCALE;
  return x - Math.floor(x);
};

const clampUnit = (value: number) => Math.min(1, Math.max(0, value));

const MusicToggle = ({
  playing: controlledPlaying,
  defaultPlaying = false,
  onPlayingChange,
  src,
  cover,
  title,
  artist,
  bars = DEFAULT_BARS,
  progress = 0,
  onSeek,
  size = DEFAULT_SIZE,
  className,
}: MusicToggleProps) => {
  const shouldReduceMotion = !!useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const mountedRef = useRef(false);
  const rotation = useMotionValue(0);

  const [internalPlaying, setInternalPlaying] = useState(defaultPlaying);
  const isControlled = controlledPlaying !== undefined;
  const playing = isControlled ? controlledPlaying : internalPlaying;

  const handleToggle = useCallback(() => {
    const next = !playing;
    if (!isControlled) {
      setInternalPlaying(next);
    }
    onPlayingChange?.(next);
  }, [playing, isControlled, onPlayingChange]);

  useAnimationFrame((_, delta) => {
    if (!playing || shouldReduceMotion) {
      return;
    }
    rotation.set(rotation.get() + delta * ROTATION_DEG_PER_MS);
  });

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (playing) {
      audio.play().catch(() => {
        // Playback was blocked or interrupted; visual state stays in sync.
      });
    } else {
      audio.pause();
    }
  }, [playing]);

  const handleSeekKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onSeek) {
      return;
    }
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        onSeek(clampUnit(progress + SEEK_STEP));
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        onSeek(clampUnit(progress - SEEK_STEP));
        break;
      case "Home":
        event.preventDefault();
        onSeek(0);
        break;
      case "End":
        event.preventDefault();
        onSeek(1);
        break;
      default:
        break;
    }
  };

  const circumference = 2 * Math.PI * RING_RADIUS;
  const label = [title, artist].filter(Boolean).join(" — ");
  const toggleLabel = `${playing ? "Pause" : "Play"}${label ? ` ${label}` : ""}`;

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div className="relative shrink-0" style={{ height: size, width: size }}>
        <div
          aria-label={label ? `Seek ${label}` : "Seek track"}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progress * 100)}
          className="pointer-events-none absolute inset-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onKeyDown={handleSeekKeyDown}
          role="slider"
          tabIndex={onSeek ? 0 : -1}
        >
          <svg
            className="h-full w-full -rotate-90"
            viewBox={`0 0 ${RING_VIEWBOX} ${RING_VIEWBOX}`}
          >
            <circle
              className="text-foreground/10"
              cx="50"
              cy="50"
              fill="none"
              r={RING_RADIUS}
              stroke="currentColor"
              strokeWidth={RING_STROKE_WIDTH}
            />
            <motion.circle
              animate={{
                strokeDashoffset: circumference * (1 - progress),
              }}
              className="text-brand"
              cx="50"
              cy="50"
              fill="none"
              r={RING_RADIUS}
              stroke="currentColor"
              strokeDasharray={circumference}
              strokeLinecap="round"
              strokeWidth={RING_STROKE_WIDTH}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.25, ease: MOVEMENT_EASE }
              }
            />
          </svg>
        </div>

        <motion.div
          aria-hidden="true"
          className="absolute inset-[10%] overflow-hidden rounded-full border border-border bg-muted"
          style={{ rotate: rotation }}
        >
          {cover ? (
            <img alt="" className="h-full w-full object-cover" src={cover} />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand/40 to-brand/10" />
          )}
          <div className="absolute inset-[38%] rounded-full bg-background" />
        </motion.div>

        <button
          aria-label={toggleLabel}
          aria-pressed={playing}
          className="absolute inset-[38%] z-10 flex items-center justify-center rounded-full bg-background text-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={handleToggle}
          type="button"
        >
          <AnimatePresence initial={false} mode="wait">
            {playing ? (
              <motion.span
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, rotate: 0, scale: 1 }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, rotate: -45, scale: 0.6 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, rotate: 45, scale: 0.6 }
                }
                key="pause"
                transition={shouldReduceMotion ? { duration: 0 } : SPRING}
              >
                <Pause className="size-4 fill-current" />
              </motion.span>
            ) : (
              <motion.span
                animate={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, rotate: 0, scale: 1 }
                }
                exit={
                  shouldReduceMotion
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, rotate: 45, scale: 0.6 }
                }
                initial={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, rotate: -45, scale: 0.6 }
                }
                key="play"
                transition={shouldReduceMotion ? { duration: 0 } : SPRING}
              >
                <Play className="size-4 fill-current" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {title || artist ? (
          <div className="flex flex-col">
            {title ? (
              <span className="font-medium text-foreground text-sm">
                {title}
              </span>
            ) : null}
            {artist ? (
              <span className="text-muted-foreground text-xs">{artist}</span>
            ) : null}
          </div>
        ) : null}
        <div aria-hidden="true" className="flex h-5 items-end gap-[2px]">
          {Array.from({ length: bars }).map((_, index) => {
            const heightSeed = hashUnit(index);
            const durationSeed = hashUnit(index + 0.5);
            const delaySeed = hashUnit(index + 0.25);
            const minScale = BAR_MIN_SCALE + heightSeed * 0.15;
            const maxScale = BAR_MAX_SCALE - (1 - heightSeed) * 0.3;
            const duration =
              BAR_BASE_DURATION + durationSeed * BAR_DURATION_JITTER;
            const delay = delaySeed * duration;
            const animate =
              playing && !shouldReduceMotion
                ? { scaleY: [minScale, maxScale, minScale] }
                : { scaleY: minScale };
            const transition =
              playing && !shouldReduceMotion
                ? {
                    delay,
                    duration,
                    ease: MOVEMENT_EASE,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror" as const,
                  }
                : { duration: 0 };
            return (
              <motion.span
                animate={animate}
                className="w-[2px] rounded-full bg-foreground/70"
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-count, order-stable waveform bars
                key={index}
                style={{ height: "100%", transformOrigin: "bottom" }}
                transition={transition}
              />
            );
          })}
        </div>
      </div>

      {src ? (
        <audio ref={audioRef} src={src}>
          <track kind="captions" />
        </audio>
      ) : null}
    </div>
  );
};

export default MusicToggle;
