"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import VideoAmbient from "@repo/smoothui/components/video-ambient";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { type CSSProperties, useId, useState } from "react";

/**
 * Picked by measurement, not by eye. Every candidate was decoded, each sampled
 * frame collapsed to 1×1 — the exact colour the glow ever sees — and scored on
 * mean saturation, mean value, hue travel per second and the share of frames
 * that are near-black or near-grey. This clip, at 1920×1080:
 *
 *   saturation 0.648  ·  value 0.799  ·  hue travel 95.6°/s
 *   luminance flicker 0.171/s  ·  0% dark frames  ·  0% grey frames
 *
 * against the 854×480 clip it replaces (saturation 0.341, value 0.644, hue
 * travel 78.2°/s, 9% grey frames). Nearly twice the chroma and none of the
 * washed-out stretches, with *less* luminance flicker despite more hue travel —
 * so the surround repaints continuously without strobing.
 *
 * "Vibrant Abstract Colorful Waves Animation" by Nicola Narracci, Pexels
 * License. Hot-linked rather than vendored: it is someone else's work, and a
 * multi-megabyte binary does not belong in a component library. Pexels serves
 * it over HTTPS with `access-control-allow-origin: *` and range requests.
 */
const AMBIENT_VIDEO_SRC =
  "https://videos.pexels.com/video-files/35567433/15070529_1920_1080_30fps.mp4";
const AMBIENT_VIDEO_CREDIT_HREF =
  "https://www.pexels.com/video/vibrant-abstract-colorful-waves-animation-35567433/";

const DEFAULT_INTENSITY = 0.85;
const INTENSITY_MIN = 0;
const INTENSITY_MAX = 1.2;
const INTENSITY_STEP = 0.05;
const PERCENT = 100;

export default function VideoAmbientDemo() {
  const [glow, setGlow] = useState(true);
  const [intensity, setIntensity] = useState(DEFAULT_INTENSITY);
  const intensityId = useId();

  return (
    /* The dark surface is the component's canvas, not scenery: an ambient light
       has to have somewhere dim to spill into, and a bloom rendered onto a white
       page is just a pale smear. So it bleeds to the frame's own edges — no
       inner card, no rounded corners, no border, nothing nested. Because the
       surface is a fixed colour in either theme, everything sitting on it is
       coloured against that surface rather than against the theme tokens, which
       would go dark-on-dark in light mode. */
    <div className="flex min-h-[30rem] w-full flex-col items-center justify-center gap-4 self-stretch bg-[oklch(0.13_0.008_275)] px-6 pt-16 pb-10 sm:px-10 sm:pt-20">
      {/* The player is deliberately small relative to the space around it: the
          surround is the demo. The padding below it is what lets the falloff
          finish before the controls instead of glowing through them. */}
      <div className="flex w-full max-w-3xl items-center justify-center pb-14 sm:pb-16">
        <VideoAmbient
          alt="An abstract animation of saturated colour waves flowing into each other"
          blur={46}
          className="aspect-video w-full max-w-md"
          gain={1.15}
          glow={glow}
          intensity={intensity}
          loop
          muted
          rounded={12}
          saturation={2.2}
          scale={1.45}
          src={AMBIENT_VIDEO_SRC}
        />
      </div>

      <div className="relative flex w-full max-w-3xl flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label
            className="font-medium text-[11px] text-white/65"
            htmlFor={intensityId}
          >
            Intensity
          </label>
          <input
            className="h-1.5 w-40 cursor-pointer accent-brand disabled:cursor-default disabled:opacity-40"
            disabled={!glow}
            id={intensityId}
            max={INTENSITY_MAX}
            min={INTENSITY_MIN}
            onChange={(event) => setIntensity(Number(event.target.value))}
            step={INTENSITY_STEP}
            type="range"
            value={intensity}
          />
          <span className="font-mono text-[11px] text-white/65 tabular-nums">
            {Math.round(intensity * PERCENT)}%
          </span>
        </div>

        {/* `--btn` is set inline rather than through `color`, so the toggle is
            painted against this surface instead of against the page theme —
            `color="neutral"` resolves to the theme foreground, which is
            near-black here and leaves the control invisible in light mode. */}
        <SmoothButton
          aria-pressed={glow}
          onClick={() => setGlow((value) => !value)}
          prefix={glow ? <Lightbulb /> : <LightbulbOff />}
          size="sm"
          style={{ "--btn": "#fff" } as CSSProperties}
          variant={glow ? "soft" : "ghost"}
        >
          {glow ? "Glow on" : "Glow off"}
        </SmoothButton>
      </div>

      <p className="relative w-full max-w-3xl text-[11px] text-white/60">
        Footage:{" "}
        <a
          className="text-white/75 underline decoration-dotted underline-offset-2 hover:text-white"
          href={AMBIENT_VIDEO_CREDIT_HREF}
          rel="noopener"
          target="_blank"
        >
          Vibrant Abstract Colorful Waves Animation
        </a>{" "}
        by Nicola Narracci, Pexels License. 1920×1080, hot-linked.
      </p>
    </div>
  );
}
