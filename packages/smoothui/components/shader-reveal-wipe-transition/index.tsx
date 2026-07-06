"use client";

import type { ReactNode } from "react";
import ShaderRevealTransition from "../shader-reveal-transition";

export interface ShaderRevealWipeTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const ShaderRevealWipeTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: ShaderRevealWipeTransitionProps) => (
  <ShaderRevealTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="wipe"
  >
    {children}
  </ShaderRevealTransition>
);

export default ShaderRevealWipeTransition;
