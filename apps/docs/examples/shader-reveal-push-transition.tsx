"use client";

import ShaderRevealPushTransition from "@repo/smoothui/components/shader-reveal-push-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealPushTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealPushTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealPushTransition>
    )}
    scene="editorial"
  />
);

export default ShaderRevealPushTransitionDemo;
