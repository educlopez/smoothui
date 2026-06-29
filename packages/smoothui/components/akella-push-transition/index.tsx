"use client";

import type { ReactNode } from "react";
import AkellaImageTransition from "../akella-image-transition";

export interface AkellaPushTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const AkellaPushTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: AkellaPushTransitionProps) => (
  <AkellaImageTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="push"
  >
    {children}
  </AkellaImageTransition>
);

export default AkellaPushTransition;
