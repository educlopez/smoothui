"use client";

import PreviewCard from "@repo/smoothui/components/preview-card";

const FeaturesDemo = () => (
  <div className="flex items-center justify-center p-8">
    <PreviewCard
      side="bottom"
      trigger={
        <a
          className="font-medium text-sm underline decoration-dotted underline-offset-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          href="https://smoothui.dev"
        >
          @smoothui
        </a>
      }
    >
      <div className="space-y-1">
        <p className="font-medium text-sm">SmoothUI</p>
        <p className="text-muted-foreground text-sm">
          Beautifully designed React components with smooth animations.
        </p>
      </div>
    </PreviewCard>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
};

export default function PreviewCardDemo() {
  return <FeaturesDemo />;
}
