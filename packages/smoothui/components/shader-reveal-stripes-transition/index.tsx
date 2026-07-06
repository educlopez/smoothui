"use client";

import type { ReactNode } from "react";
import ShaderRevealTransition from "../shader-reveal-transition";

export interface ShaderRevealStripesTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const ShaderRevealStripesTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: ShaderRevealStripesTransitionProps) => (
  <ShaderRevealTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="stripes"
  >
    {children}
  </ShaderRevealTransition>
);

export default ShaderRevealStripesTransition;
