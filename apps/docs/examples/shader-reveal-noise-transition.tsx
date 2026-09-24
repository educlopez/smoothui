"use client";

import ShaderRevealNoiseTransition from "@repo/smoothui/components/shader-reveal-noise-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealNoiseTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealNoiseTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealNoiseTransition>
    )}
    scene="signal"
  />
);

export default ShaderRevealNoiseTransitionDemo;
