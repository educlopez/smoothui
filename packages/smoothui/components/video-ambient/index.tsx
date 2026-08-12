"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const DEFAULT_INTENSITY = 0.9;
const DEFAULT_BLUR_PX = 34;
const DEFAULT_SAMPLE_RATE_FPS = 12;
const DEFAULT_SCALE = 1.3;
const DEFAULT_SATURATION = 1.9;
const DEFAULT_GAIN = 1.7;
const GLOW_BRIGHTNESS = 1.12;
const BLOOM_BRIGHTNESS = 1.2;
const DEFAULT_ROUNDED_PX = 20;

/**
 * The sampled canvas is deliberately tiny. The glow is a colour field, not a
 * picture — a low-resolution grab left to the browser's own bilinear upscaling
 * is already a soft gradient, so the CSS blur only has to finish the job.
 */
const SAMPLE_WIDTH = 24;
const SAMPLE_HEIGHT = 14;

/** The outer pass is bigger, softer and more saturated than the inner one. */
const BLOOM_SCALE_FACTOR = 1.55;
const BLOOM_BLUR_FACTOR = 1.9;
const BLOOM_SATURATION_FACTOR = 1.2;
const BLOOM_OPACITY_FACTOR = 0.6;

const MS_PER_SECOND = 1000;
const MIN_SAMPLE_RATE = 1;
const MAX_SAMPLE_RATE = 60;
const GLOW_FADE_MS = 400;
const STATIC_GRADIENT_OPACITY_FACTOR = 0.55;
const HAVE_CURRENT_DATA = 2;

/* -------------------------------------------------------------------------- */
/* Public types                                                               */
/* -------------------------------------------------------------------------- */

export type VideoAmbientProps = {
  /** Describes the video content for assistive technology. */
  alt: string;
  autoPlay?: boolean;
  /** Blur radius in pixels on the inner glow. The outer bloom doubles it. */
  blur?: number;
  className?: string;
  controls?: boolean;
  /**
   * Extra light pushed into the glow. The sampled frame is composited onto
   * itself with `lighter`, so 1 is the video's own brightness and anything
   * above it reads as emitted light rather than a colour wash. Values past
   * ~2.2 clip the highlights to white.
   */
  gain?: number;
  /** Turn the ambient glow off entirely — useful for an A/B toggle. */
  glow?: boolean;
  /** Glow opacity, 0–1. */
  intensity?: number;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
  /** Border radius in pixels applied to the video itself. */
  rounded?: number;
  /** How many times per second the glow re-samples the current frame. */
  sampleRate?: number;
  /** Colour boost on the glow, 1 = the video's own saturation. */
  saturation?: number;
  /** How far past the video's edges the inner glow bleeds, 1 = no bleed. */
  scale?: number;
  src: string;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A video with an ambient glow sampled from its own frames.
 *
 * Two passes make the effect read: an inner glow scaled just past the player's
 * edges, and a much larger, softer, more saturated bloom behind it. Both are
 * drawn from the same 24×14 grab, so the bleed costs two `drawImage` calls per
 * sample regardless of the video's real resolution.
 *
 * No pixel data is ever read back, so the effect survives a cross-origin source
 * with no CORS headers. The one thing that can still fail is `drawImage` itself,
 * which a handful of strict configurations throw on for a tainted source; that
 * failure is caught and the glow falls back to a blurred poster or a
 * theme-coloured gradient.
 */
const VideoAmbient = ({
  alt,
  autoPlay = true,
  blur = DEFAULT_BLUR_PX,
  className,
  controls = false,
  gain = DEFAULT_GAIN,
  glow = true,
  intensity = DEFAULT_INTENSITY,
  loop = true,
  muted = true,
  poster,
  rounded = DEFAULT_ROUNDED_PX,
  sampleRate = DEFAULT_SAMPLE_RATE_FPS,
  saturation = DEFAULT_SATURATION,
  scale = DEFAULT_SCALE,
  src,
}: VideoAmbientProps) => {
  const shouldReduceMotion = Boolean(useReducedMotion());

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const innerCanvasRef = useRef<HTMLCanvasElement>(null);
  const bloomCanvasRef = useRef<HTMLCanvasElement>(null);
  /** Mirrors `hasFrame` so the sample loop never sets state per frame. */
  const hasFrameRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isOnScreen, setIsOnScreen] = useState(true);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);

  // Autoplay never fights reduced motion — a moving glow behind a page that
  // asked to stay still is the exact thing the preference exists to prevent.
  const effectiveAutoPlay = autoPlay && !shouldReduceMotion;
  const showSampledGlow = glow && hasFrame && !isBlocked;
  const showFallbackGlow = glow && !showSampledGlow;

  const sampleFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < HAVE_CURRENT_DATA) {
      return;
    }
    const extraGain = Math.max(0, gain - 1);
    const canvases = [innerCanvasRef.current, bloomCanvasRef.current];
    for (const canvas of canvases) {
      const ctx = canvas?.getContext("2d");
      if (!(canvas && ctx)) {
        continue;
      }
      try {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (extraGain > 0) {
          // Composited onto itself with `lighter`, the frame gains light rather
          // than paint. Without this the glow reads as a tint over whatever it
          // sits on — the difference between a lamp and a coloured filter.
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = extraGain;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = 1;
        }
      } catch {
        // A few strict configurations throw on drawImage for a tainted
        // cross-origin source — the static fallback below takes over.
        setIsBlocked(true);
        return;
      }
    }
    if (!hasFrameRef.current) {
      hasFrameRef.current = true;
      setHasFrame(true);
    }
  }, [gain]);

  // Playback state is read from the element rather than assumed, so a video
  // that was already playing before this effect ran still drives the loop.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const sync = () => setIsPlaying(!(video.paused || video.ended));
    sync();
    const events = ["play", "playing", "pause", "ended", "loadeddata"];
    for (const event of events) {
      video.addEventListener(event, sync);
    }
    return () => {
      for (const event of events) {
        video.removeEventListener(event, sync);
      }
    };
  }, []);

  // Some browsers reject a programmatic-looking autoplay even when muted; a
  // rejected promise here just means the user presses play themselves.
  useEffect(() => {
    const video = videoRef.current;
    if (!(video && effectiveAutoPlay)) {
      return;
    }
    const attempt = () => {
      video.play().catch(() => {
        /* Autoplay refused — controls remain available. */
      });
    };
    if (video.readyState >= HAVE_CURRENT_DATA) {
      attempt();
      return;
    }
    video.addEventListener("loadeddata", attempt, { once: true });
    return () => video.removeEventListener("loadeddata", attempt);
  }, [effectiveAutoPlay]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const observer = new IntersectionObserver(([entry]) =>
      setIsOnScreen(entry.isIntersecting)
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleVisibility = () => setIsTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // Reduced motion draws exactly one frame and stops there: the glow stays
  // present, it just never moves again.
  useEffect(() => {
    if (!(glow && shouldReduceMotion)) {
      return;
    }
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.readyState >= HAVE_CURRENT_DATA) {
      sampleFrame();
      return;
    }
    video.addEventListener("loadeddata", sampleFrame, { once: true });
    return () => video.removeEventListener("loadeddata", sampleFrame);
  }, [glow, sampleFrame, shouldReduceMotion]);

  // Sampling only runs while there is something worth sampling: playing, on
  // screen, and the tab actually visible. The loop is rAF-driven and throttled
  // rather than interval-driven so it never fires on a frame the browser is
  // already dropping.
  useEffect(() => {
    const isWorthSampling =
      glow &&
      !(isBlocked || shouldReduceMotion) &&
      isPlaying &&
      isOnScreen &&
      isTabVisible;
    if (!isWorthSampling) {
      return;
    }
    const minDelta =
      MS_PER_SECOND /
      Math.min(MAX_SAMPLE_RATE, Math.max(MIN_SAMPLE_RATE, sampleRate));
    let frameId = 0;
    let lastSampleAt = 0;
    const tick = (now: number) => {
      frameId = requestAnimationFrame(tick);
      if (now - lastSampleAt < minDelta) {
        return;
      }
      lastSampleAt = now;
      sampleFrame();
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [
    glow,
    isBlocked,
    isOnScreen,
    isPlaying,
    isTabVisible,
    sampleFrame,
    sampleRate,
    shouldReduceMotion,
  ]);

  const glowTransition = `opacity ${GLOW_FADE_MS}ms cubic-bezier(0.23, 1, 0.32, 1)`;

  return (
    <div className={cn("relative isolate", className)} ref={containerRef}>
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          {/* Outer bloom: bigger, softer, more saturated. */}
          <canvas
            className="absolute inset-0 size-full"
            height={SAMPLE_HEIGHT}
            ref={bloomCanvasRef}
            style={{
              filter: `blur(${blur * BLOOM_BLUR_FACTOR}px) saturate(${saturation * BLOOM_SATURATION_FACTOR}) brightness(${BLOOM_BRIGHTNESS})`,
              opacity: showSampledGlow ? intensity * BLOOM_OPACITY_FACTOR : 0,
              transform: `scale(${scale * BLOOM_SCALE_FACTOR})`,
              transition: glowTransition,
            }}
            width={SAMPLE_WIDTH}
          />
          {/* Inner glow: hugs the player, carries the colour. */}
          <canvas
            className="absolute inset-0 size-full"
            height={SAMPLE_HEIGHT}
            ref={innerCanvasRef}
            style={{
              filter: `blur(${blur}px) saturate(${saturation}) brightness(${GLOW_BRIGHTNESS})`,
              opacity: showSampledGlow ? intensity : 0,
              transform: `scale(${scale})`,
              transition: glowTransition,
            }}
            width={SAMPLE_WIDTH}
          />
        </div>
      ) : null}

      {/* Stays mounted so the first sampled frame crossfades in rather than cutting. */}
      {glow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            opacity: showFallbackGlow ? 1 : 0,
            transition: glowTransition,
          }}
        >
          {poster ? (
            <img
              alt=""
              className="absolute inset-0 size-full object-cover"
              src={poster}
              style={{
                filter: `blur(${blur}px) saturate(${saturation})`,
                opacity: intensity * STATIC_GRADIENT_OPACITY_FACTOR,
                transform: `scale(${scale})`,
              }}
            />
          ) : (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--color-brand, currentColor) 0%, transparent 70%)",
                filter: `blur(${blur}px)`,
                opacity: intensity * STATIC_GRADIENT_OPACITY_FACTOR,
                transform: `scale(${scale})`,
              }}
            />
          )}
        </div>
      ) : null}

      <video
        aria-label={alt}
        autoPlay={effectiveAutoPlay}
        className="relative z-10 block size-full object-cover"
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline
        poster={poster}
        ref={videoRef}
        src={src}
        style={{ borderRadius: rounded }}
      />
    </div>
  );
};

export default VideoAmbient;
