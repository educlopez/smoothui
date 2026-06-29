"use client";

import AkellaWipeTransition from "@repo/smoothui/components/akella-wipe-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const AkellaWipeTransitionDemo = () => (
  <TransitionDemoFrame
    description="A directional shader wipe for moving between adjacent product sections."
    renderTransition={({ children, className, transitionKey }) => (
      <AkellaWipeTransition className={className} transitionKey={transitionKey}>
        {children}
      </AkellaWipeTransition>
    )}
    title="Displacement wipe"
  />
);

export default AkellaWipeTransitionDemo;
