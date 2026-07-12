"use client";

import PrismSweepTransition from "@repo/smoothui/components/prism-sweep-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const PrismSweepTransitionDemo = () => (
  <TransitionDemoFrame
    description="A faceted prism field for major state changes across the whole component frame."
    renderTransition={({ children, className, transitionKey }) => (
      <PrismSweepTransition
        className={className}
        direction="left"
        duration={1500}
        transitionKey={transitionKey}
      >
        {children}
      </PrismSweepTransition>
    )}
    title="Prism sweep"
  />
);

export default PrismSweepTransitionDemo;
