"use client";

import { useInView } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./coverage-carousel.module.css";

interface Mark {
  label: string;
  src: string;
  url: string;
  wide?: boolean;
}

/** Adapted from the user-supplied Devouring Details rows/stagger prototype. */
export function CoverageCarousel({ items }: { items: Mark[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const [reduced, setReduced] = useState<boolean | null>(null);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const running =
    inView && reduced === false && !paused && !hovered && !focused && !hidden;

  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  useEffect(() => {
    if (!running) {
      return;
    }
    const timer = setInterval(() => {
      if (!ref.current?.contains(document.activeElement)) {
        setFrame((value) => value + 1);
      }
    }, 2800);
    return () => clearInterval(timer);
  }, [running]);

  const renderMark = (item: Mark, position: number, exiting = false) => (
    <a
      aria-label={item.label}
      className={styles.mark}
      href={item.url}
      key={item.label}
      rel="noopener noreferrer"
      style={{ animationDelay: `${position * 70}ms` }}
      tabIndex={exiting ? -1 : undefined}
      target="_blank"
      title={item.label}
    >
      <Image
        alt={item.label}
        className="h-8 w-auto max-w-full object-contain dark:rounded dark:bg-white dark:p-1"
        height={32}
        src={item.src}
        unoptimized
        width={item.wide ? 144 : 32}
      />
    </a>
  );
  const row = (step: number) =>
    Array.from(
      { length: 4 },
      (_, index) => items[(step * 4 + index) % items.length]
    );

  return (
    <div className="mt-10" data-carousel-running={running} ref={ref}>
      <div
        className={styles.stage}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") {
            setHovered(true);
          }
        }}
        onPointerLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(false);
          }
        }}
      >
        {reduced || paused ? (
          <div className="flex flex-wrap items-center justify-center gap-6">
            {items.map((item, index) => renderMark(item, index))}
          </div>
        ) : (
          <>
            {frame > 0 ? (
              <div
                aria-hidden="true"
                className={`${styles.row} ${styles.exit}`}
                inert
                key={`${frame}-exit`}
              >
                {row(frame - 1).map((item, index) =>
                  renderMark(item, index, true)
                )}
              </div>
            ) : null}
            <div
              className={`${styles.row} ${frame > 0 ? styles.enter : ""}`}
              key={`${frame}-enter`}
            >
              {row(frame).map((item, index) => renderMark(item, index))}
            </div>
          </>
        )}
      </div>
      {reduced ? null : (
        <button
          aria-pressed={paused}
          className="sr-only focus:not-sr-only focus:mt-2 focus:min-h-10 focus:rounded-lg focus:px-3 focus:text-xs focus:outline-2 focus:outline-ring"
          onClick={() => setPaused((value) => !value)}
          type="button"
        >
          {paused ? "Resume logo animation" : "Pause logo animation"}
        </button>
      )}
    </div>
  );
}
