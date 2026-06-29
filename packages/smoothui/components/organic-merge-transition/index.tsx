"use client";

import type { ReactNode } from "react";
import SdfBlobTransition from "../sdf-blob-transition";

export interface OrganicMergeTransitionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  onRest?: () => void;
  transitionKey: string | number;
}

const OrganicMergeTransition = ({
  children,
  className,
  duration = 1120,
  onRest,
  transitionKey,
}: OrganicMergeTransitionProps) => (
  <SdfBlobTransition
    className={className}
    duration={duration}
    onRest={onRest}
    transitionKey={transitionKey}
    variant="merge"
  >
    {children}
  </SdfBlobTransition>
);

export default OrganicMergeTransition;
