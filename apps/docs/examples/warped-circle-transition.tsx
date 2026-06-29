"use client";

import WarpedCircleTransition from "@repo/smoothui/components/warped-circle-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const WarpedCircleTransitionDemo = () => (
  <TransitionDemoFrame
    description="A warped radial edge that gives the transition a handcrafted feel."
    renderTransition={({ children, className, transitionKey }) => (
      <WarpedCircleTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </WarpedCircleTransition>
    )}
    title="Warped circle"
  />
);

export default WarpedCircleTransitionDemo;
