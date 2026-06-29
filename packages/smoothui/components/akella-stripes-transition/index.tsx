"use client";

import type { ReactNode } from "react";
import AkellaImageTransition from "../akella-image-transition";

export interface AkellaStripesTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const AkellaStripesTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: AkellaStripesTransitionProps) => (
  <AkellaImageTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="stripes"
  >
    {children}
  </AkellaImageTransition>
);

export default AkellaStripesTransition;
