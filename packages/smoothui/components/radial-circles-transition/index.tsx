"use client";

import type { ReactNode } from "react";
import SdfBlobTransition from "../sdf-blob-transition";

export interface RadialCirclesTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const RadialCirclesTransition = ({
  children,
  className,
  duration = 1120,
  onRest,
  transitionKey,
}: RadialCirclesTransitionProps) => (
  <SdfBlobTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="radial"
  >
    {children}
  </SdfBlobTransition>
);

export default RadialCirclesTransition;
