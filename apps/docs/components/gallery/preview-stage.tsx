"use client";

import { type ReactNode, useContext, useEffect, useRef, useState } from "react";

import { MasonryItemContext } from "./masonry-grid";

/** Width a page-scale demo is laid out at before being scaled into the tile. */
const STAGE_WIDTH = 880;

/**
 * Tallest a live (unscaled) demo may grow. Beyond this we clip the top of the
 * demo rather than shrinking the whole thing into an unreadable thumbnail.
 */
const LIVE_MAX_HEIGHT = 520;

/** Floor so short demos (avatars, toggles) still fill a comfortable card. */
const DEFAULT_MIN_HEIGHT = 168;

export interface PreviewStageProps {
  children: ReactNode;
  /**
   * Render the demo immediately instead of waiting for the tile to approach
   * the viewport. Set on the first screenful, which has no approach to wait
   * for and is what a reader — or a crawler — sees first.
   */
  eager?: boolean;
  maxHeight?: number;
  /** Ceiling on the thumbnail scale, so a demo is never blown up. */
  maxScale?: number;
  minHeight?: number;
  padding?: number;
  stageWidth?: number;
}

/**
 * A demo fitted to whatever width the tile happens to have.
 *
 * Preference order:
 *
 * 1. **Live.** Lay the demo out at the column width, real size, top-aligned.
 *    Height follows content (capped). This is what makes masonry look like
 *    masonry — short toggles stay short, dense AI panels get tall cards.
 * 2. **Clipped live.** Same as live, but the demo is taller than the cap:
 *    show the top and fade the bottom instead of shrinking everything.
 * 3. **Thumbnail.** Only when the demo cannot fit the column width (hard
 *    min-width / page chrome). Laid out on a stage and scaled to fill the
 *    tile; reports itself as wide so the grid can give it two columns.
 *
 * Styles are written to the DOM directly: measuring feeds back into the
 * measured element, so a React state pass per reading would loop.
 */
export const PreviewStage = ({
  maxScale = 0.92,
  stageWidth = STAGE_WIDTH,
  minHeight = DEFAULT_MIN_HEIGHT,
  maxHeight = LIVE_MAX_HEIGHT,
  padding = 20,
  eager = false,
  children,
}: PreviewStageProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(eager);
  const item = useContext(MasonryItemContext);
  const reportRef = useRef(item?.report);
  reportRef.current = item?.report;

  useEffect(() => {
    if (ready) {
      return;
    }
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    const host = hostRef.current;
    const stage = stageRef.current;
    if (!(host && stage && ready)) {
      return;
    }

    let frame = 0;

    const clearFade = () => {
      host.style.maskImage = "";
      host.style.webkitMaskImage = "";
    };

    const applyFade = () => {
      const fade =
        "linear-gradient(to bottom, #000 0%, #000 78%, transparent 100%)";
      host.style.maskImage = fade;
      host.style.webkitMaskImage = fade;
    };

    const apply = () => {
      const available = host.clientWidth - padding * 2;
      if (available <= 0) {
        return;
      }

      // Natural size on the design-width stage (used to detect squeeze).
      stage.style.transform = "none";
      stage.style.transformOrigin = "top left";
      stage.style.width = `${stageWidth}px`;
      stage.style.left = `${padding}px`;
      stage.style.top = `${padding}px`;
      const natural = stage.scrollHeight;

      // Same demo at the column's own width.
      stage.style.width = `${available}px`;
      const liveWidth = stage.scrollWidth;
      const liveHeight = stage.scrollHeight;
      const overflowsColumn = liveWidth > available + 2;
      const squeezed = liveHeight > natural * 1.4 + 12;

      if (!(overflowsColumn || squeezed)) {
        // Live — real size, top-aligned. Height follows content.
        const contentHeight = liveHeight + padding * 2;
        const clipped = contentHeight > maxHeight;
        const height = Math.max(minHeight, Math.min(maxHeight, contentHeight));

        stage.style.transform = "none";
        stage.style.left = `${padding}px`;
        stage.style.top = `${padding}px`;
        host.style.height = `${height}px`;

        if (clipped) {
          applyFade();
        } else {
          clearFade();
        }
        return;
      }

      // Thumbnail — page-scale layout scaled to fill the column width.
      stage.style.width = `${stageWidth}px`;
      const scale = Math.min(maxScale, available / stageWidth);
      const scaledHeight = natural * scale;
      const contentHeight = scaledHeight + padding * 2;
      const clipped = contentHeight > maxHeight;
      const height = Math.max(minHeight, Math.min(maxHeight, contentHeight));

      stage.style.left = `${padding}px`;
      stage.style.top = `${padding}px`;
      stage.style.transformOrigin = "top left";
      stage.style.transform = `scale(${scale})`;
      host.style.height = `${height}px`;

      if (clipped) {
        applyFade();
      } else {
        clearFade();
      }

      // Wide demos get two columns so the thumbnail stays readable.
      reportRef.current?.(2);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };

    schedule();

    const observer = new ResizeObserver(schedule);
    observer.observe(host);

    // Demos often settle after fonts / images / motion mount.
    const timer = window.setTimeout(schedule, 400);
    const late = window.setTimeout(schedule, 1200);
    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      fontsReady.then(schedule);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.clearTimeout(late);
      observer.disconnect();
      clearFade();
    };
  }, [ready, maxScale, stageWidth, minHeight, maxHeight, padding]);

  return (
    <div
      className="relative w-full overflow-hidden"
      ref={hostRef}
      style={{ height: minHeight }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        inert
        ref={stageRef}
        style={{ width: stageWidth }}
      >
        {ready ? children : null}
      </div>
    </div>
  );
};
