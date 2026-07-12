"use client";

export type { SmoothButtonProps as ButtonProps } from "@repo/smoothui/components/smooth-button";
// Single source of truth: the docs/landing chrome button IS the published DS
// component. Re-exported under the historical `Button` / `buttonVariants` names
// so existing call sites keep working while the visual system stays unified.
export {
  default as Button,
  smoothButtonVariants as buttonVariants,
} from "@repo/smoothui/components/smooth-button";
