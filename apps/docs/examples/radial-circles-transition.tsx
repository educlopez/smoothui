"use client";

import RadialCirclesTransition from "@repo/smoothui/components/radial-circles-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const RadialCirclesTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <RadialCirclesTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </RadialCirclesTransition>
    )}
    scene="subject"
  />
);

export default RadialCirclesTransitionDemo;
