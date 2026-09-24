"use client";

import SdfBlobTransition from "@repo/smoothui/components/sdf-blob-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const SdfBlobTransitionDemo = () => (
  <TransitionDemoFrame
    renderTransition={({ children, className, transitionKey }) => (
      <SdfBlobTransition className={className} transitionKey={transitionKey}>
        {children}
      </SdfBlobTransition>
    )}
    scene="subject"
  />
);

export default SdfBlobTransitionDemo;
