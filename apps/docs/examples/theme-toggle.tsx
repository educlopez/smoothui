"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import type { ThemeToggleValue } from "@repo/smoothui/components/theme-toggle";
import ThemeToggle, {
  THEME_TOGGLE_VARIANTS,
} from "@repo/smoothui/components/theme-toggle";
import { useState } from "react";

const VARIANT_CAPTIONS: Record<string, string> = {
  orb: "Lit sphere · specular travels",
  pill: "Segmented · layoutId thumb",
  "sun-moon": "One disc, carved by a mask",
  switch: "Sky-to-night track · lit knob",
};

const SURFACES: Record<
  ThemeToggleValue,
  { card: string; chip: string; panel: string; sub: string }
> = {
  dark: {
    card: "border-slate-800 bg-slate-900/70",
    chip: "bg-indigo-500/15 text-indigo-300",
    panel: "border-slate-800 bg-slate-950 text-slate-100",
    sub: "text-slate-400",
  },
  light: {
    card: "border-slate-200 bg-slate-50",
    chip: "bg-amber-500/15 text-amber-600",
    panel: "border-slate-200 bg-white text-slate-900",
    sub: "text-slate-500",
  },
  system: {
    card: "border-slate-300/70 bg-white/70",
    chip: "bg-slate-500/15 text-slate-600",
    panel:
      "border-slate-300 bg-gradient-to-br from-white via-slate-100 to-slate-300 text-slate-900",
    sub: "text-slate-600",
  },
};

export default function ThemeToggleDemo() {
  const [theme, setTheme] = useState<ThemeToggleValue>("light");
  const surface = SURFACES[theme];
  const binaryTheme: ThemeToggleValue = theme === "system" ? "light" : theme;

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col gap-2.5 overflow-y-auto rounded-2xl border p-4 transition-colors duration-300",
        surface.panel
      )}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <h3 className="font-semibold text-base tracking-tight">Appearance</h3>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-1 font-medium text-xs capitalize",
              surface.chip
            )}
          >
            {theme}
          </span>
          <SmoothButton
            onClick={() => setTheme("system")}
            shape="pill"
            size="xs"
            variant="outline"
          >
            Reset
          </SmoothButton>
        </div>
      </header>

      <div className="grid shrink-0 grid-cols-2 gap-2.5 sm:grid-cols-4">
        {THEME_TOGGLE_VARIANTS.map((variant) => (
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border px-2 py-3 transition-colors duration-300",
              surface.card
            )}
            key={variant}
          >
            <div className="flex h-[84px] items-center justify-center">
              <ThemeToggle
                onThemeChange={setTheme}
                showSystem={false}
                size="md"
                theme={binaryTheme}
                variant={variant}
              />
            </div>
            <div className="text-center">
              <p className="font-mono text-[11px] uppercase tracking-wide">
                {variant}
              </p>
              <p
                className={cn("mt-0.5 text-[11px] leading-tight", surface.sub)}
              >
                {VARIANT_CAPTIONS[variant]}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "flex shrink-0 flex-col gap-2 rounded-xl border px-3 py-2.5 transition-colors duration-300",
          surface.card
        )}
      >
        <p className={cn("text-[10px] uppercase tracking-widest", surface.sub)}>
          Three-way · light / dark / system
        </p>
        <div className="flex flex-wrap items-center justify-around gap-x-6 gap-y-3">
          {THEME_TOGGLE_VARIANTS.map((variant) => (
            <ThemeToggle
              key={variant}
              onThemeChange={setTheme}
              showSystem
              size="sm"
              theme={theme}
              variant={variant}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
