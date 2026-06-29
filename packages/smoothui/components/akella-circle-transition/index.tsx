"use client";

import type { ReactNode } from "react";
import AkellaImageTransition from "../akella-image-transition";

export interface AkellaCircleTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const AkellaCircleTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: AkellaCircleTransitionProps) => (
  <AkellaImageTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="circle"
  >
    {children}
  </AkellaImageTransition>
);

export default AkellaCircleTransition;
