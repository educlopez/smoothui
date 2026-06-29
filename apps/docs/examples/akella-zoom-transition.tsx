"use client";

import AkellaZoomTransition from "@repo/smoothui/components/akella-zoom-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const AkellaZoomTransitionDemo = () => (
  <TransitionDemoFrame
    description="A soft lens movement for switching between compact dashboard and marketing states."
    renderTransition={({ children, className, transitionKey }) => (
      <AkellaZoomTransition className={className} transitionKey={transitionKey}>
        {children}
      </AkellaZoomTransition>
    )}
    title="Zoom wash"
  />
);

export default AkellaZoomTransitionDemo;
