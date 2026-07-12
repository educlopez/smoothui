"use client";

import type { ReactNode } from "react";
import ShaderRevealTransition from "../shader-reveal-transition";

export interface ShaderRevealCircleTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const ShaderRevealCircleTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: ShaderRevealCircleTransitionProps) => (
  <ShaderRevealTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="circle"
  >
    {children}
  </ShaderRevealTransition>
);

export default ShaderRevealCircleTransition;
