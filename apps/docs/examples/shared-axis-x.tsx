"use client";

import SharedAxisX from "@repo/smoothui/components/shared-axis-x";

const SharedAxisXDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <SharedAxisX
      className="font-bold text-4xl tracking-tight"
      phrases={[
        "Move with purpose.",
        "Direction matters.",
        "Axis of progress.",
      ]}
    />
  </div>
);

export default SharedAxisXDemo;
