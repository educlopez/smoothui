"use client";

import SdfCircleTransition from "@repo/smoothui/components/sdf-circle-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const SdfCircleTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <SdfCircleTransition className={className} transitionKey={transitionKey}>
        {children}
      </SdfCircleTransition>
    )}
    scene="subject"
  />
);

export default SdfCircleTransitionDemo;
