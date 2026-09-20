"use client";

import { type ReactNode, useContext, useEffect, useRef, useState } from "react";

import { MasonryItemContext } from "./masonry-grid";

/** Width a demo is laid out at when it has to be shown as a thumbnail. */
const STAGE_WIDTH = 1024;

/** Tallest a demo may be and still be shown at its real size. */
const LIVE_MAX_HEIGHT = 300;

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
 * Two outcomes, decided by the measurement:
 *
 * - **Live.** The demo already fits the tile and is short. It is rendered at
 *   the tile's own width, unscaled, so a button looks like a button rather
 *   than a third-size picture of one.
 * - **Thumbnail.** The demo wants a page. It is laid out on a full-width
 *   stage and scaled down to fit, and reports itself as wide so the grid can
 *   hand it two columns.
 *
 * All of it is applied to the DOM directly rather than through state: the
 * measurement changes the element it measures, so a render pass per reading
 * would be a loop.
 */
export const PreviewStage = ({
  maxScale = 0.6,
  stageWidth = STAGE_WIDTH,
  minHeight = 132,
  maxHeight = 460,
  padding = 24,
  eager = false,
  children,
}: PreviewStageProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(eager);
  const item = useContext(MasonryItemContext);
  const reportRef = useRef(item?.report);
  reportRef.current = item?.report;

  useEffect(() => {
    if (live) {
      return;
    }
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setLive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "700px 0px" }
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [live]);

  useEffect(() => {
    const host = hostRef.current;
    const stage = stageRef.current;
    if (!(host && stage && live)) {
      return;
    }

    let frame = 0;

    const apply = () => {
      const available = host.clientWidth - padding * 2;
      if (available <= 0) {
        return;
      }

      // First reading: the demo on the full-width stage it was written for.
      stage.style.transform = "none";
      stage.style.transformOrigin = "center";
      stage.style.width = `${stageWidth}px`;
      const natural = stage.scrollHeight;

      // Second reading: the same demo at the tile's own width. Overflowing
      // means something inside has a minimum bigger than the column; growing
      // much taller than it was at full width means it is not overflowing,
      // it is being wrung out — a header stacking into four lines.
      stage.style.width = `${available}px`;
      stage.style.left = `${padding}px`;
      stage.style.top = "50%";

      const liveWidth = stage.scrollWidth;
      const liveHeight = stage.scrollHeight;
      const squeezed = liveHeight > natural * 1.35 + 8;

      if (
        liveWidth <= available + 1 &&
        liveHeight <= LIVE_MAX_HEIGHT &&
        !squeezed
      ) {
        stage.style.transform = "translateY(-50%)";
        host.style.height = `${Math.max(minHeight, liveHeight + padding * 2)}px`;
        return;
      }

      stage.style.width = `${stageWidth}px`;
      const scale = Math.min(maxScale, available / stageWidth);
      const scaled = natural * scale;
      const height = Math.min(
        maxHeight,
        Math.max(minHeight, scaled + padding * 2)
      );

      host.style.height = `${height}px`;

      if (scaled + padding * 2 <= height) {
        stage.style.left = "50%";
        stage.style.top = "50%";
        stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
      } else {
        stage.style.left = "50%";
        stage.style.top = `${padding}px`;
        stage.style.transformOrigin = "top center";
        stage.style.transform = `translateX(-50%) scale(${scale})`;
      }

      reportRef.current?.(2);
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };

    schedule();

    const observer = new ResizeObserver(schedule);
    observer.observe(host);

    const timer = window.setTimeout(schedule, 400);
    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      fontsReady.then(schedule);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [live, maxScale, stageWidth, minHeight, maxHeight, padding]);

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
        {live ? children : null}
      </div>
    </div>
  );
};
