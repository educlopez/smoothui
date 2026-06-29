"use client";

import type { ReactNode } from "react";
import AkellaImageTransition from "../akella-image-transition";

export interface AkellaNoiseTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const AkellaNoiseTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: AkellaNoiseTransitionProps) => (
  <AkellaImageTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="noise"
  >
    {children}
  </AkellaImageTransition>
);

export default AkellaNoiseTransition;
