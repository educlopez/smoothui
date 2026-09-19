"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import Squircle, { squirclePath } from "@repo/smoothui/components/squircle";
import {
  Calendar,
  Camera,
  Compass,
  MessageCircle,
  Music,
  Settings,
} from "lucide-react";
import { useState } from "react";

const TILE = 176;
const TILE_RADIUS = 46;
const ICON_RADIUS = 13;
const PRESETS = [0, 0.6, 1];

const APP_ICONS = [
  { bg: "var(--color-brand)", fg: "#fff", Icon: Camera, label: "Camera" },
  {
    bg: "var(--color-blue)",
    fg: "var(--color-blue-fg)",
    Icon: MessageCircle,
    label: "Messages",
  },
  {
    bg: "var(--color-green)",
    fg: "var(--color-green-fg)",
    Icon: Compass,
    label: "Maps",
  },
  {
    bg: "var(--color-amber)",
    fg: "var(--color-amber-fg)",
    Icon: Music,
    label: "Music",
  },
  {
    bg: "var(--color-foreground)",
    fg: "var(--color-background)",
    Icon: Calendar,
    label: "Calendar",
  },
  {
    bg: "var(--color-destructive)",
    fg: "#fff",
    Icon: Settings,
    label: "Settings",
  },
];

export default function SquircleDemo() {
  const [smoothing, setSmoothing] = useState(0.6);

  return (
    <div className="grid h-full w-full grid-cols-1 items-center gap-6 overflow-y-auto lg:grid-cols-[auto_1fr] lg:gap-8">
      <div className="flex items-start justify-center gap-5">
        <figure className="flex flex-col items-center gap-2.5">
          <div className="relative" style={{ height: TILE, width: TILE }}>
            <div
              className="h-full w-full bg-foreground/10"
              style={{ borderRadius: TILE_RADIUS }}
            />
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full text-brand"
              fill="none"
              viewBox={`0 0 ${TILE} ${TILE}`}
            >
              <path
                d={squirclePath(TILE, TILE, TILE_RADIUS, smoothing)}
                stroke="currentColor"
                strokeDasharray="6 5"
                strokeWidth={2}
              />
            </svg>
          </div>
          <figcaption className="text-center">
            <span className="block font-medium text-[12px] text-foreground">
              border-radius
            </span>
            <span className="block font-mono text-[10px] text-muted-foreground tabular-nums">
              {TILE_RADIUS}px arc
            </span>
          </figcaption>
        </figure>

        <figure className="flex flex-col items-center gap-2.5">
          <div className="relative" style={{ height: TILE, width: TILE }}>
            <Squircle
              className="h-full w-full bg-brand/25"
              radius={TILE_RADIUS}
              smoothing={smoothing}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 border-2 border-foreground/35 border-dashed"
              style={{ borderRadius: TILE_RADIUS }}
            />
          </div>
          <figcaption className="text-center">
            <span className="block font-medium text-[12px] text-foreground">
              Squircle
            </span>
            <span className="block font-mono text-[10px] text-muted-foreground tabular-nums">
              smoothing {smoothing.toFixed(2)}
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <label
            className="font-medium text-[13px] text-foreground"
            htmlFor="squircle-smoothing"
          >
            Smoothing
          </label>
          <input
            className="h-1.5 w-40 cursor-pointer appearance-none rounded-full bg-foreground/15"
            id="squircle-smoothing"
            max={1}
            min={0}
            onChange={(event) => setSmoothing(Number(event.target.value))}
            step={0.02}
            style={{ accentColor: "var(--color-brand)" }}
            type="range"
            value={smoothing}
          />
          <span className="font-mono text-[12px] text-muted-foreground tabular-nums">
            {smoothing.toFixed(2)}
          </span>
          <div className="flex gap-1.5">
            {PRESETS.map((preset) => (
              <SmoothButton
                color="accent"
                key={preset}
                onClick={() => setSmoothing(preset)}
                shape="pill"
                size="xs"
                variant={smoothing === preset ? "solid" : "outline"}
              >
                {preset.toFixed(1)}
              </SmoothButton>
            ))}
          </div>
        </div>

        <p className="max-w-md text-[12px] text-muted-foreground leading-relaxed">
          At <span className="tabular-nums">0.00</span> the corner is exactly a
          circular arc, so both tiles are identical. Push it up and the squircle
          spreads its curvature into the flat edges — the dashed line on each
          tile is the shape it is <em>not</em>.
        </p>

        <ul className="flex flex-wrap gap-4">
          {APP_ICONS.map(({ Icon, bg, fg, label }) => (
            <li className="flex flex-col items-center gap-1.5" key={label}>
              <Squircle
                className="flex size-14 items-center justify-center"
                radius={ICON_RADIUS}
                smoothing={smoothing}
              >
                <span
                  className="flex size-full items-center justify-center"
                  style={{ backgroundColor: bg, color: fg }}
                >
                  <Icon className="size-6" strokeWidth={1.75} />
                </span>
              </Squircle>
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
