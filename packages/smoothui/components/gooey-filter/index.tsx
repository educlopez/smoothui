"use client";

import { cn } from "@repo/shadcn-ui/lib/utils";
import { type ElementType, type ReactNode, useId } from "react";

const DEFAULT_STRENGTH = 8;
const DEFAULT_CONTRAST = 18;
const CONTRAST_TO_STRENGTH_RATIO = DEFAULT_CONTRAST / DEFAULT_STRENGTH;
const MATRIX_ALPHA_OFFSET_RATIO = -0.5;

export interface GooeyFilterProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  contrast?: number;
  disabled?: boolean;
  intensity?: number;
  strength?: number;
}

/**
 * Returns a unique, DOM-safe id suitable for referencing an SVG filter via
 * `url(#id)`, generated with React's `useId`.
 */
export const useGooeyFilterId = (): string => useId();

export default function GooeyFilter({
  as,
  children,
  className,
  contrast,
  disabled = false,
  intensity,
  strength,
}: GooeyFilterProps) {
  const filterId = useGooeyFilterId();
  const Wrapper = as ?? "div";

  const resolvedStrength = strength ?? intensity ?? DEFAULT_STRENGTH;
  const resolvedContrast =
    contrast ??
    (intensity === undefined
      ? DEFAULT_CONTRAST
      : intensity * CONTRAST_TO_STRENGTH_RATIO);

  if (disabled) {
    return <Wrapper className={className}>{children}</Wrapper>;
  }

  return (
    <>
      <svg
        aria-hidden="true"
        className="absolute"
        style={{ height: 0, overflow: "hidden", width: 0 }}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation={resolvedStrength}
            />
            <feColorMatrix
              in="blur"
              result="goo"
              type="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${resolvedContrast} ${resolvedContrast * MATRIX_ALPHA_OFFSET_RATIO}`}
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <Wrapper
        className={cn(className)}
        style={{ filter: `url(#${filterId})` }}
      >
        {children}
      </Wrapper>
    </>
  );
}
