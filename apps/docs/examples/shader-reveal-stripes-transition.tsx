"use client";

import ShaderRevealStripesTransition from "@repo/smoothui/components/shader-reveal-stripes-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealStripesTransitionDemo = () => (
  <TransitionDemoFrame
    description="Segmented strips create a crisp, mechanical handoff between states."
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealStripesTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealStripesTransition>
    )}
    title="Stripe shutter"
  />
);

export default ShaderRevealStripesTransitionDemo;
