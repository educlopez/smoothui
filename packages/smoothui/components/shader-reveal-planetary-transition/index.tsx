"use client";

import type { ReactNode } from "react";
import ShaderRevealTransition from "../shader-reveal-transition";

export interface ShaderRevealPlanetaryTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const ShaderRevealPlanetaryTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: ShaderRevealPlanetaryTransitionProps) => (
  <ShaderRevealTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="planetary"
  >
    {children}
  </ShaderRevealTransition>
);

export default ShaderRevealPlanetaryTransition;
