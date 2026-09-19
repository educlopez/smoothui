"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type AsciiColorMode = "mono" | "source";

export interface AsciiRenderSource {
  /** URL of the image or video to sample. Must allow cross-origin reads. */
  src: string;
  /** Kind of media behind `src`. */
  type: "image" | "video";
}

export interface AsciiRenderProps {
  /** Description of the media. Exposed to assistive technology. */
  alt: string;
  /** Character ramp ordered dense to sparse. */
  charset?: string;
  /** Extra classes for the wrapper. */
  className?: string;
  /** `mono` paints one theme colour, `source` tints the glyphs with the frame. */
  color?: AsciiColorMode;
  /** Number of character columns sampled across the frame. */
  columns?: number;
  /** Glyph size in pixels. */
  fontSize?: number;
  /** Frames per second for video sources. */
  fps?: number;
  /** Flip the luminance-to-character mapping. */
  invert?: boolean;
  /** Hold the current frame without tearing down the renderer. */
  paused?: boolean;
  /** Media descriptor. */
  source: AsciiRenderSource;
}

type RenderStatus = "fallback" | "loading" | "ready";

const DEFAULT_CHARSET = "@%#*+=-:. ";
const DEFAULT_COLUMNS = 80;
const DEFAULT_FONT_SIZE = 10;
const DEFAULT_FPS = 24;
const MIN_COLUMNS = 8;
const MAX_COLUMNS = 240;
const MIN_FPS = 1;
const MAX_FPS = 60;
const CHAR_ASPECT = 0.5;
const CHANNELS = 4;
const MAX_CHANNEL = 255;
const LUMA_R = 0.2126;
const LUMA_G = 0.7152;
const LUMA_B = 0.0722;
const MS_PER_SECOND = 1000;
const NEWLINE = "\n";
const VISIBILITY_MARGIN = "0px 0px 10% 0px";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const buildAscii = (
  data: Uint8ClampedArray,
  columns: number,
  rows: number,
  charset: string,
  invert: boolean
) => {
  const lastIndex = charset.length - 1;
  const glyphs: string[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const offset = (y * columns + x) * CHANNELS;
      const luminance =
        (data[offset] * LUMA_R +
          data[offset + 1] * LUMA_G +
          data[offset + 2] * LUMA_B) /
        MAX_CHANNEL;
      const level = invert ? 1 - luminance : luminance;
      glyphs.push(charset[clamp(Math.round(level * lastIndex), 0, lastIndex)]);
    }
    glyphs.push(NEWLINE);
  }
  return glyphs.join("");
};

const AsciiRender = ({
  alt,
  charset = DEFAULT_CHARSET,
  className,
  color = "mono",
  columns = DEFAULT_COLUMNS,
  fontSize = DEFAULT_FONT_SIZE,
  fps = DEFAULT_FPS,
  invert = false,
  paused = false,
  source,
}: AsciiRenderProps) => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<RenderStatus>("loading");
  const [isVisible, setIsVisible] = useState(true);

  const { src: sourceSrc, type: sourceType } = source;
  const safeCharset = charset.length > 1 ? charset : DEFAULT_CHARSET;
  const safeColumns = clamp(Math.round(columns), MIN_COLUMNS, MAX_COLUMNS);
  const safeFps = clamp(Math.round(fps), MIN_FPS, MAX_FPS);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { rootMargin: VISIBILITY_MARGIN }
    );
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const pre = preRef.current;
    const media = sourceType === "video" ? videoRef.current : imageRef.current;
    if (!(pre && media && sourceSrc)) {
      return;
    }

    const grid = document.createElement("canvas");
    const context = grid.getContext("2d", { willReadFrequently: true });
    if (!context) {
      setStatus("fallback");
      return;
    }

    const video = sourceType === "video" ? (media as HTMLVideoElement) : null;
    const image = sourceType === "image" ? (media as HTMLImageElement) : null;
    let frame = 0;
    let lastDrawnAt = 0;
    let isCancelled = false;

    const naturalSize = () => {
      if (video) {
        return { height: video.videoHeight, width: video.videoWidth };
      }
      return {
        height: image?.naturalHeight ?? 0,
        width: image?.naturalWidth ?? 0,
      };
    };

    const drawFrame = () => {
      const { height: mediaHeight, width: mediaWidth } = naturalSize();
      if (mediaWidth === 0 || mediaHeight === 0) {
        return false;
      }
      const rows = Math.max(
        1,
        Math.round((safeColumns * mediaHeight * CHAR_ASPECT) / mediaWidth)
      );
      grid.width = safeColumns;
      grid.height = rows;
      context.clearRect(0, 0, safeColumns, rows);
      context.drawImage(media, 0, 0, safeColumns, rows);

      const { data } = context.getImageData(0, 0, safeColumns, rows);
      pre.textContent = buildAscii(
        data,
        safeColumns,
        rows,
        safeCharset,
        invert
      );
      pre.style.backgroundImage =
        color === "source" ? `url(${grid.toDataURL()})` : "";
      return true;
    };

    const safeDraw = () => {
      try {
        return drawFrame();
      } catch {
        setStatus("fallback");
        return false;
      }
    };

    const tick = (time: number) => {
      if (isCancelled) {
        return;
      }
      const interval = MS_PER_SECOND / safeFps;
      if (time - lastDrawnAt >= interval) {
        lastDrawnAt = time;
        if (!safeDraw()) {
          return;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (isCancelled) {
        return;
      }
      if (!safeDraw()) {
        return;
      }
      setStatus("ready");
      const isStatic = !video || shouldReduceMotion || paused || !isVisible;
      if (isStatic) {
        video?.pause();
        return;
      }
      const playback = video.play();
      playback?.catch(() => {
        setStatus("fallback");
      });
      frame = requestAnimationFrame(tick);
    };

    const handleError = () => {
      if (!isCancelled) {
        setStatus("fallback");
      }
    };

    if (video) {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        start();
      } else {
        video.addEventListener("loadeddata", start, { once: true });
      }
      video.addEventListener("error", handleError);
    } else if (image) {
      if (image.complete) {
        start();
      } else {
        image.addEventListener("load", start, { once: true });
      }
      image.addEventListener("error", handleError);
    }

    return () => {
      isCancelled = true;
      cancelAnimationFrame(frame);
      video?.removeEventListener("loadeddata", start);
      video?.removeEventListener("error", handleError);
      video?.pause();
      image?.removeEventListener("load", start);
      image?.removeEventListener("error", handleError);
      grid.width = 0;
      grid.height = 0;
    };
  }, [
    color,
    invert,
    isVisible,
    paused,
    safeCharset,
    safeColumns,
    safeFps,
    shouldReduceMotion,
    sourceSrc,
    sourceType,
  ]);

  const isFallback = status === "fallback";
  const mediaClassName = cn(
    "h-full w-full object-contain",
    isFallback ? "relative" : "pointer-events-none absolute inset-0 opacity-0"
  );

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-xl bg-background",
        className
      )}
      ref={containerRef}
    >
      {sourceType === "video" ? (
        <video
          aria-hidden="true"
          className={mediaClassName}
          crossOrigin="anonymous"
          loop
          muted
          playsInline
          preload="auto"
          ref={videoRef}
          src={sourceSrc}
          tabIndex={-1}
        />
      ) : (
        <img
          alt=""
          aria-hidden="true"
          className={mediaClassName}
          crossOrigin="anonymous"
          ref={imageRef}
          src={sourceSrc}
        />
      )}

      <pre
        aria-hidden="true"
        className={cn(
          "m-0 select-none whitespace-pre font-mono",
          color === "mono" ? "text-foreground" : "text-transparent",
          isFallback ? "hidden" : "block"
        )}
        ref={preRef}
        style={{
          backgroundClip: color === "source" ? "text" : undefined,
          backgroundSize: "100% 100%",
          fontSize,
          imageRendering: "pixelated",
          lineHeight: 1,
          WebkitBackgroundClip: color === "source" ? "text" : undefined,
        }}
      />

      <span className="sr-only">{alt}</span>
    </div>
  );
};

export default AsciiRender;
