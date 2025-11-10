"use client";

import NumberFlow from "@repo/smoothui/components/number-flow";

const Example = () => (
  <div className="flex min-h-[300px] items-center justify-center">
    <NumberFlow max={999} min={0} />
  </div>
);

export default Example;
