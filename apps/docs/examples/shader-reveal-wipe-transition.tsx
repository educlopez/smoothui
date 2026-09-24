"use client";

import ShaderRevealWipeTransition from "@repo/smoothui/components/shader-reveal-wipe-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealWipeTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealWipeTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealWipeTransition>
    )}
    scene="editorial"
  />
);

export default ShaderRevealWipeTransitionDemo;
