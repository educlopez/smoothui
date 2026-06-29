"use client";

import type { ReactNode } from "react";
import AkellaImageTransition from "../akella-image-transition";

export interface AkellaPlanetaryTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const AkellaPlanetaryTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: AkellaPlanetaryTransitionProps) => (
  <AkellaImageTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="planetary"
  >
    {children}
  </AkellaImageTransition>
);

export default AkellaPlanetaryTransition;
