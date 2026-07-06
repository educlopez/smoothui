"use client";

import ShaderRevealPushTransition from "@repo/smoothui/components/shader-reveal-push-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealPushTransitionDemo = () => (
  <TransitionDemoFrame
    description="A pushed flow for transitions that should feel directional and continuous."
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealPushTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealPushTransition>
    )}
    title="Noise push"
  />
);

export default ShaderRevealPushTransitionDemo;
