"use client";

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

const TileDemo = () => (
  <div className="flex items-center justify-center p-8">
    <Squircle
      className="size-[176px] bg-brand/25"
      radius={TILE_RADIUS}
      smoothing={0.6}
    />
  </div>
);

const ComparisonDemo = () => (
  <div className="flex items-center justify-center gap-5 p-8">
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
          d={squirclePath(TILE, TILE, TILE_RADIUS, 0.6)}
          stroke="currentColor"
          strokeDasharray="6 5"
          strokeWidth={2}
        />
      </svg>
    </div>

    <Squircle
      className="size-[176px] bg-brand/25"
      radius={TILE_RADIUS}
      smoothing={0.6}
    />
  </div>
);

const SmoothingDemo = () => {
  const [smoothing, setSmoothing] = useState(0.6);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Squircle
        className="size-[176px] bg-brand/25"
        radius={TILE_RADIUS}
        smoothing={smoothing}
      />
      <input
        aria-label="Smoothing"
        className="h-1.5 w-40 cursor-pointer appearance-none rounded-full bg-foreground/15"
        max={1}
        min={0}
        onChange={(event) => setSmoothing(Number(event.target.value))}
        step={0.02}
        style={{ accentColor: "var(--color-brand)" }}
        type="range"
        value={smoothing}
      />
    </div>
  );
};

const AppIconsDemo = () => (
  <div className="flex flex-wrap items-center justify-center gap-4 p-8">
    {APP_ICONS.map(({ Icon, bg, fg, label }) => (
      <Squircle
        className="flex size-14 items-center justify-center"
        key={label}
        radius={ICON_RADIUS}
        smoothing={0.6}
      >
        <span
          className="flex size-full items-center justify-center"
          style={{ backgroundColor: bg, color: fg }}
        >
          <Icon className="size-6" strokeWidth={1.75} />
        </span>
      </Squircle>
    ))}
  </div>
);

export const demoScenes = {
  "App Icons": AppIconsDemo,
  Comparison: ComparisonDemo,
  Features: TileDemo,
  Smoothing: SmoothingDemo,
  Tile: TileDemo,
};

export default function SquircleDemo() {
  return <TileDemo />;
}
