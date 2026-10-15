"use client";

import Textarea from "@repo/smoothui/components/textarea";

const FeaturesDemo = () => (
  <div className="w-full max-w-sm p-8">
    <Textarea aria-label="Message" placeholder="Write a message…" />
  </div>
);

const CompactDemo = () => (
  <div className="w-full max-w-sm p-8">
    <Textarea aria-label="Note" placeholder="Quick note" rows={2} />
  </div>
);

export const demoScenes = {
  Compact: CompactDemo,
  Features: FeaturesDemo,
};

export default function TextareaDemo() {
  return <FeaturesDemo />;
}
