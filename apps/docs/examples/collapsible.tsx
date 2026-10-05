"use client";

import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
} from "@repo/smoothui/components/collapsible";

const FeaturesDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <CollapsibleRoot className="w-full max-w-sm">
      <CollapsibleTrigger>Recovery keys</CollapsibleTrigger>
      <CollapsiblePanel>
        <p className="font-mono text-xs">alien-bean-pasta</p>
        <p className="font-mono text-xs">wild-irish-burrito</p>
        <p className="font-mono text-xs">horse-battery-staple</p>
      </CollapsiblePanel>
    </CollapsibleRoot>
  </div>
);

const DefaultOpenDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <CollapsibleRoot className="w-full max-w-sm" defaultOpen>
      <CollapsibleTrigger>API keys</CollapsibleTrigger>
      <CollapsiblePanel>
        <p className="font-mono text-xs">sk_live_••••••••4f2a</p>
        <p className="font-mono text-xs">sk_test_••••••••9c1e</p>
      </CollapsiblePanel>
    </CollapsibleRoot>
  </div>
);

const DisabledDemo = () => (
  <div className="flex w-full items-center justify-center p-8">
    <CollapsibleRoot className="w-full max-w-sm" disabled>
      <CollapsibleTrigger>Billing details</CollapsibleTrigger>
      <CollapsiblePanel>Hidden until enabled.</CollapsiblePanel>
    </CollapsibleRoot>
  </div>
);

export const demoScenes = {
  "Default open": DefaultOpenDemo,
  Disabled: DisabledDemo,
  Features: FeaturesDemo,
};

export default function CollapsibleDemo() {
  return <FeaturesDemo />;
}
