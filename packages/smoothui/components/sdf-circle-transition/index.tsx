"use client";

import type { ReactNode } from "react";
import SdfBlobTransition from "../sdf-blob-transition";

export interface SdfCircleTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const SdfCircleTransition = ({
  children,
  className,
  duration = 1120,
  onRest,
  transitionKey,
}: SdfCircleTransitionProps) => (
  <SdfBlobTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="circle"
  >
    {children}
  </SdfBlobTransition>
);

export default SdfCircleTransition;
