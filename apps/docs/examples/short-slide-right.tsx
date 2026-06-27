"use client";

import ShortSlideRight from "@repo/smoothui/components/short-slide-right";

const ShortSlideRightDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <ShortSlideRight
      className="font-bold text-4xl tracking-tight"
      phrases={[
        "Move with intent.",
        "Words glide across.",
        "Build the rhythm.",
      ]}
    />
  </div>
);

export default ShortSlideRightDemo;
