"use client";

import type { ReactNode } from "react";
import AkellaImageTransition from "../akella-image-transition";

export interface AkellaWipeTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const AkellaWipeTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: AkellaWipeTransitionProps) => (
  <AkellaImageTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="wipe"
  >
    {children}
  </AkellaImageTransition>
);

export default AkellaWipeTransition;
