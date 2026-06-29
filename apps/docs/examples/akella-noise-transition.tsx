"use client";

import AkellaNoiseTransition from "@repo/smoothui/components/akella-noise-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const AkellaNoiseTransitionDemo = () => (
  <TransitionDemoFrame
    description="A textured threshold reveal for product states that should feel deliberate, not loud."
    renderTransition={({ children, className, transitionKey }) => (
      <AkellaNoiseTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </AkellaNoiseTransition>
    )}
    title="Noise gate"
  />
);

export default AkellaNoiseTransitionDemo;
