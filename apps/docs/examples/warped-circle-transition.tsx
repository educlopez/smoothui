"use client";

import WarpedCircleTransition from "@repo/smoothui/components/warped-circle-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const WarpedCircleTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <WarpedCircleTransition
        className={className}
        transitionKey={transitionKey}
      >
        {children}
      </WarpedCircleTransition>
    )}
    scene="subject"
  />
);

export default WarpedCircleTransitionDemo;
