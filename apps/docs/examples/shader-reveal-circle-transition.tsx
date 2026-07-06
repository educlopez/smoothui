"use client";

import ShaderRevealCircleTransition from "@repo/smoothui/components/shader-reveal-circle-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealCircleTransitionDemo = () => (
  <TransitionDemoFrame
    description="A radial reveal that works best when the next surface needs a clear focal point."
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealCircleTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealCircleTransition>
    )}
    title="Circle reveal"
  />
);

export default ShaderRevealCircleTransitionDemo;
