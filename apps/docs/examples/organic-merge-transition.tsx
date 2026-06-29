"use client";

import OrganicMergeTransition from "@repo/smoothui/components/organic-merge-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const OrganicMergeTransitionDemo = () => (
  <TransitionDemoFrame
    description="Soft merged shapes reveal a new state while keeping the underlying UI readable."
    renderTransition={({ children, className, transitionKey }) => (
      <OrganicMergeTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </OrganicMergeTransition>
    )}
    title="Organic merge"
  />
);

export default OrganicMergeTransitionDemo;
