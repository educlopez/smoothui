"use client";

import SharedAxisZ from "@repo/smoothui/components/shared-axis-z";

const SharedAxisZDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <SharedAxisZ
      className="font-bold text-4xl tracking-tight"
      phrases={[
        "Zooming between states.",
        "Elevate and settle.",
        "Scale with purpose.",
      ]}
    />
  </div>
);

export default SharedAxisZDemo;
