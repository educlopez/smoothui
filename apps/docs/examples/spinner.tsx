"use client";

import Spinner from "@repo/smoothui/components/spinner";

const FeaturesDemo = () => (
  <div className="flex items-center gap-6 p-8">
    <Spinner size="sm" />
    <Spinner />
    <Spinner size="lg" />
  </div>
);

const LabeledDemo = () => (
  <div className="flex items-center gap-2 p-8 text-muted-foreground text-sm">
    <Spinner aria-label="Saving changes" />
    Saving…
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  Labeled: LabeledDemo,
};

export default function SpinnerDemo() {
  return <FeaturesDemo />;
}
