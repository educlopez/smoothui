"use client";

import ShaderRevealCircleTransition from "@repo/smoothui/components/shader-reveal-circle-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealCircleTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealCircleTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealCircleTransition>
    )}
    scene="subject"
  />
);

export default ShaderRevealCircleTransitionDemo;
