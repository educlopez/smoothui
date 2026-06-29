"use client";

import type { ReactNode } from "react";
import AkellaImageTransition from "../akella-image-transition";

export interface AkellaZoomTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const AkellaZoomTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: AkellaZoomTransitionProps) => (
  <AkellaImageTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="zoom"
  >
    {children}
  </AkellaImageTransition>
);

export default AkellaZoomTransition;
