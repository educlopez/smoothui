"use client";

import AkellaCircleTransition from "@repo/smoothui/components/akella-circle-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const AkellaCircleTransitionDemo = () => (
  <TransitionDemoFrame
    description="A radial reveal that works best when the next surface needs a clear focal point."
    renderTransition={({ children, className, transitionKey }) => (
      <AkellaCircleTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </AkellaCircleTransition>
    )}
    title="Circle reveal"
  />
);

export default AkellaCircleTransitionDemo;
