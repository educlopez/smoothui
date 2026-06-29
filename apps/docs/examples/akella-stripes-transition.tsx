"use client";

import AkellaStripesTransition from "@repo/smoothui/components/akella-stripes-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const AkellaStripesTransitionDemo = () => (
  <TransitionDemoFrame
    description="Segmented strips create a crisp, mechanical handoff between states."
    renderTransition={({ children, className, transitionKey }) => (
      <AkellaStripesTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </AkellaStripesTransition>
    )}
    title="Stripe shutter"
  />
);

export default AkellaStripesTransitionDemo;
