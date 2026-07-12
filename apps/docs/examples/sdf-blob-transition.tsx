"use client";

import SdfBlobTransition from "@repo/smoothui/components/sdf-blob-transition";
import { TransitionDemoFrame } from "./transition-demo-frame";

const SdfBlobTransitionDemo = () => (
  <TransitionDemoFrame
    description="A soft blob reveal that feels organic without adding extra chrome."
    renderTransition={({ children, className, transitionKey }) => (
      <SdfBlobTransition className={className} transitionKey={transitionKey}>
        {children}
      </SdfBlobTransition>
    )}
    title="SDF blob"
  />
);

export default SdfBlobTransitionDemo;
