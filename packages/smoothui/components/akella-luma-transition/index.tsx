"use client";

import type { ReactNode } from "react";
import AkellaImageTransition from "../akella-image-transition";

export interface AkellaLumaTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const AkellaLumaTransition = ({
  children,
  className,
  duration = 1080,
  onRest,
  transitionKey,
}: AkellaLumaTransitionProps) => (
  <AkellaImageTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="luma"
  >
    {children}
  </AkellaImageTransition>
);

export default AkellaLumaTransition;
