"use client";

import ShortSlideDown from "@repo/smoothui/components/short-slide-down";

const ShortSlideDownDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <ShortSlideDown
      className="font-bold text-4xl tracking-tight"
      phrases={["Words drop down", "Lines stack centered", "Build the column"]}
    />
  </div>
);

export default ShortSlideDownDemo;
