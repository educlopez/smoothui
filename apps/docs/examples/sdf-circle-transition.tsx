"use client";

import SdfCircleTransition from "@repo/smoothui/components/sdf-circle-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const SdfCircleTransitionDemo = () => (
  <TransitionDemoFrame
    description="A clean circular reveal for simple before-and-after state changes."
    renderTransition={({ children, className, transitionKey }) => (
      <SdfCircleTransition className={className} transitionKey={transitionKey}>
        {children}
      </SdfCircleTransition>
    )}
    title="SDF circle"
  />
);

export default SdfCircleTransitionDemo;
