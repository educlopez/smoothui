"use client";

/**
 * @deprecated Renamed to `morph-surface`.
 *
 * This component was never an AI input: its default export has always been
 * `MorphSurface`, a feedback dock that morphs a pill into a panel. The name sent
 * people looking for a chat composer — that is `ai-prompt-input`.
 *
 * This shim keeps `npx shadcn@latest add @smoothui/ai-input` working for one
 * release. Import from `morph-surface` instead:
 *
 * ```tsx
 * import MorphSurface from "@/components/smoothui/morph-surface";
 * ```
 */
export { default, default as MorphSurface } from "../morph-surface";
