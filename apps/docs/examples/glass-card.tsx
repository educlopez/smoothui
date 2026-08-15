"use client";

import GlassCard from "@repo/smoothui/components/glass-card";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useState } from "react";

const PROGRESS = 42;

const PHOTO =
  "url(https://ik.imagekit.io/16u211libb/smoothui/scenes/silk-waves.webp?tr=w-1200,h-800,f-auto) center/cover no-repeat";
/** Saturated gradient over the right two thirds — the diagonal seam it forms
 * with the photo is the first hard edge the rim has to bend. */
const VIVID =
  "linear-gradient(140deg, oklch(0.7 0.2 28) 0%, oklch(0.58 0.22 318) 48%, oklch(0.72 0.14 205) 100%)";
/** Hard black-and-white stripes, banded across the lower third so both
 * comparison panes cross the same ones below their text. A bent stripe at the
 * rim is impossible to argue with. */
const STRIPES =
  "repeating-linear-gradient(28deg, oklch(0.98 0 0) 0 18px, transparent 18px 44px, oklch(0.15 0 0) 44px 62px, transparent 62px 88px)";

const SHADOWED = "[text-shadow:0_1px_3px_oklch(0_0_0/0.6)]";

const GlassCardDemo = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: PHOTO }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: VIVID,
          clipPath: "polygon(44% 0, 100% 0, 100% 100%, 18% 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: STRIPES,
          clipPath: "polygon(0 68%, 100% 68%, 100% 100%, 0 100%)",
        }}
      />

      <div className="relative flex size-full flex-col justify-center gap-4 p-5">
        <GlassCard className="w-full" radius={28}>
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="size-14 shrink-0 rounded-lg bg-[url(https://ik.imagekit.io/16u211libb/smoothui/scenes/cyan-aurora.webp?tr=w-160,h-160,f-auto)] bg-center bg-cover ring-1 ring-white/25 ring-inset"
            />
            <div className="min-w-0 flex-1">
              <p
                className={`truncate font-semibold text-[0.9375rem] text-white tracking-tight ${SHADOWED}`}
              >
                Refraction Index
              </p>
              <p className={`truncate text-white/85 text-xs ${SHADOWED}`}>
                Liquid Glass — Side A
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <SmoothButton
                aria-label="Shuffle"
                className="hidden text-white hover:bg-white/15 sm:inline-flex"
                size="icon-sm"
                variant="ghost"
              >
                <Shuffle />
              </SmoothButton>
              <SmoothButton
                aria-label="Previous track"
                className="text-white hover:bg-white/15"
                size="icon-sm"
                variant="ghost"
              >
                <SkipBack />
              </SmoothButton>
              <SmoothButton
                aria-label={isPlaying ? "Pause" : "Play"}
                color="neutral"
                onClick={() => setIsPlaying((playing) => !playing)}
                shape="pill"
                size="icon-lg"
                variant="solid"
              >
                {isPlaying ? <Pause /> : <Play />}
              </SmoothButton>
              <SmoothButton
                aria-label="Next track"
                className="text-white hover:bg-white/15"
                size="icon-sm"
                variant="ghost"
              >
                <SkipForward />
              </SmoothButton>
              <SmoothButton
                aria-label="Repeat"
                className="hidden text-white hover:bg-white/15 sm:inline-flex"
                size="icon-sm"
                variant="ghost"
              >
                <Repeat />
              </SmoothButton>
            </div>
          </div>

          <div className="mt-4">
            <div
              aria-label="Playback progress"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={PROGRESS}
              className="h-1 w-full overflow-hidden rounded-full bg-white/25"
              role="progressbar"
            >
              <div
                className="h-full rounded-full bg-white/90"
                style={{ width: `${PROGRESS}%` }}
              />
            </div>
            <div
              className={`mt-1.5 flex justify-between text-[0.6875rem] text-white/80 tabular-nums ${SHADOWED}`}
            >
              <span>1:42</span>
              <span>3:58</span>
            </div>
          </div>
        </GlassCard>

        <div className="flex gap-3">
          <GlassCard
            className="min-w-0 flex-1"
            radius={22}
            refraction={30}
            rimWidth={18}
          >
            <p
              className={`font-medium text-[0.8125rem] text-white ${SHADOWED}`}
            >
              refraction 30
            </p>
            <p
              className={`mt-0.5 text-[0.6875rem] text-white/85 leading-relaxed ${SHADOWED}`}
            >
              The rim bends the stripes.
            </p>
          </GlassCard>
          <GlassCard
            className="min-w-0 flex-1"
            radius={22}
            refraction={0}
            rimWidth={18}
          >
            <p
              className={`font-medium text-[0.8125rem] text-white ${SHADOWED}`}
            >
              refraction 0
            </p>
            <p
              className={`mt-0.5 text-[0.6875rem] text-white/85 leading-relaxed ${SHADOWED}`}
            >
              Same blur, straight through.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default GlassCardDemo;
