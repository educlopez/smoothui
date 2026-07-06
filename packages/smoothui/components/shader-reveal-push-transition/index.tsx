"use client";

import type { ReactNode } from "react";
import ShaderRevealTransition from "../shader-reveal-transition";

export interface ShaderRevealPushTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const ShaderRevealPushTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: ShaderRevealPushTransitionProps) => (
  <ShaderRevealTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="push"
  >
    {children}
  </ShaderRevealTransition>
);

export default ShaderRevealPushTransition;
