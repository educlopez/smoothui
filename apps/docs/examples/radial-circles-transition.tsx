"use client";

import RadialCirclesTransition from "@repo/smoothui/components/radial-circles-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const RadialCirclesTransitionDemo = () => (
  <TransitionDemoFrame
    description="Concentric motion for controlled, graphic state changes."
    renderTransition={({ children, className, transitionKey }) => (
      <RadialCirclesTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </RadialCirclesTransition>
    )}
    title="Radial circles"
  />
);

export default RadialCirclesTransitionDemo;
