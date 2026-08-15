"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "./constants";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFilmProps {
  className?: string;
  pin?: boolean;
  poster: string;
  preload?: "auto" | "metadata";
  src: string;
}

export function ScrollFilm({
  className,
  pin = true,
  poster,
  preload = "metadata",
  src,
}: ScrollFilmProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const section = root?.parentElement;
    if (!(root && video && section)) {
      return;
    }

    video.pause();

    const seek = (progress: number) => {
      if (!(video.duration && Number.isFinite(video.duration))) {
        return;
      }
      video.currentTime = progress * video.duration * 0.98;
    };

    if (prefersReducedMotion()) {
      seek(0);
      return;
    }

    const compact = window.matchMedia("(max-width: 768px)").matches;
    let pinEnd = "bottom top";
    if (pin) {
      pinEnd = compact ? "+=90%" : "+=160%";
    }

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        anticipatePin: 1,
        end: pinEnd,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          seek(self.progress);
        },
        pin,
        pinSpacing: true,
        start: pin ? "top top" : "top bottom",
        trigger: section,
      });

      const onReady = () => {
        seek(trigger.progress);
        ScrollTrigger.refresh();
      };

      if (video.readyState >= 1) {
        onReady();
      } else {
        video.addEventListener("loadedmetadata", onReady, { once: true });
      }
    }, root);

    return () => {
      ctx.revert();
    };
  }, [pin, src]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
      ref={rootRef}
    >
      <video
        className="size-full object-cover"
        muted
        playsInline
        poster={poster}
        preload={preload}
        ref={videoRef}
        src={src}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/50 to-black/28" />
      <div className="landing-grain absolute inset-0 opacity-[0.08]" />
    </div>
  );
}
