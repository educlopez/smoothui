"use client";

import PrismSweepTransition from "@repo/smoothui/components/prism-sweep-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const PrismSweepTransitionDemo = () => (
  <TransitionDemoFrame
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
    scene="signal"
  />
);

export default PrismSweepTransitionDemo;
