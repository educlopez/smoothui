"use client";

import SharedAxisY from "@repo/smoothui/components/shared-axis-y";

const SharedAxisYDemo = () => (
  <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
    <SharedAxisY
      className="font-bold text-4xl tracking-tight"
      phrases={[
        "Layered navigation.",
        "Hierarchy made clear.",
        "Depth with restraint.",
      ]}
    />
  </div>
);

export default SharedAxisYDemo;
