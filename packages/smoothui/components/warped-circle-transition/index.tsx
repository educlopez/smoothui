"use client";

import type { ReactNode } from "react";
import SdfBlobTransition from "../sdf-blob-transition";

export interface WarpedCircleTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const WarpedCircleTransition = ({
  children,
  className,
  duration = 1120,
  onRest,
  transitionKey,
}: WarpedCircleTransitionProps) => (
  <SdfBlobTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="warped"
  >
    {children}
  </SdfBlobTransition>
);

export default WarpedCircleTransition;
