"use client";

import OrganicMergeTransition from "@repo/smoothui/components/organic-merge-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const OrganicMergeTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <OrganicMergeTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </OrganicMergeTransition>
    )}
    scene="subject"
  />
);

export default OrganicMergeTransitionDemo;
