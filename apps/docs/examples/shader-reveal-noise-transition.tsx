"use client";

import ShaderRevealNoiseTransition from "@repo/smoothui/components/shader-reveal-noise-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealNoiseTransitionDemo = () => (
  <TransitionDemoFrame
    description="A textured threshold reveal for product states that should feel deliberate, not loud."
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealNoiseTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealNoiseTransition>
    )}
    title="Noise gate"
  />
);

export default ShaderRevealNoiseTransitionDemo;
