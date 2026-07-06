"use client";

import ShaderRevealWipeTransition from "@repo/smoothui/components/shader-reveal-wipe-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const ShaderRevealWipeTransitionDemo = () => (
  <TransitionDemoFrame
    description="A directional shader wipe for moving between adjacent product sections."
    renderTransition={({ children, className, transitionKey }) => (
      <ShaderRevealWipeTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </ShaderRevealWipeTransition>
    )}
    title="Displacement wipe"
  />
);

export default ShaderRevealWipeTransitionDemo;
