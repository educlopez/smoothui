"use client";

import Separator from "@repo/smoothui/components/separator";

const FeaturesDemo = () => (
  <div className="w-full max-w-sm space-y-4 p-8">
    <div className="space-y-1">
      <h4 className="font-medium text-sm leading-none">SmoothUI</h4>
      <p className="text-muted-foreground text-sm">Motion-first React UI</p>
    </div>
    <Separator />
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Components</span>
      <Separator orientation="vertical" />
      <span>Blocks</span>
    </div>
  </div>
);

const DecorativeDemo = () => (
  <div className="w-full max-w-sm space-y-4 p-8">
    <p className="font-medium text-sm">Account</p>
    <Separator decorative />
    <p className="text-muted-foreground text-sm">eduardo@smoothui.dev</p>
  </div>
);

export const demoScenes = {
  Decorative: DecorativeDemo,
  Features: FeaturesDemo,
};

export default function SeparatorDemo() {
  return <FeaturesDemo />;
}
