/**
 * Docs illustrations for SmoothUI.
 *
 * Drawings, not screenshots: skeleton shapes that say what a section holds.
 * One family of tints so the set reads together —
 * `INK` carries meaning, `GHOST` is filler. Accent details use `CANDY`
 * (same gloss as the candy button) — never flat black.
 */

export const INK = "bg-foreground/15";
export const GHOST = "bg-foreground/[0.07]";

/** Candy accent — matches SmoothButton `variant="candy"`. */
export const CANDY =
  "border-[0.5px] border-white/25 bg-gradient-to-b from-brand to-brand-secondary text-white shadow-black/20 shadow-sm ring-1 ring-[color-mix(in_oklab,var(--color-foreground)_15%,var(--color-brand))]";
