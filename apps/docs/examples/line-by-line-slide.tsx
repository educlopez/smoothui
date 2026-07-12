"use client";

import LineByLineSlide from "@repo/smoothui/components/line-by-line-slide";

const LineByLineSlideDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-6 text-center">
    <LineByLineSlide className="font-bold text-4xl tracking-tight">
      {"Beautiful by design.\nPowerful by nature."}
    </LineByLineSlide>
    <LineByLineSlide
      className="text-lg text-muted-foreground"
      delay={400}
      lines={["Per-line slide reveal.", "Apple landing page vibes."]}
    />
  </div>
);

export default LineByLineSlideDemo;
