"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import PriceFlow from "@repo/smoothui/components/price-flow";
import { useState } from "react";

const PriceFlowDemo = () => {
  const [value, setValue] = useState(25);

  const handlePriceChange = () => {
    setValue(value === 25 ? 16 : 25);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <div className="font-bold text-6xl text-foreground">
          <PriceFlow value={value} />€
        </div>
      </div>

      <div className="flex gap-4">
        <SmoothButton onClick={handlePriceChange} type="button" variant="candy">
          Change Price
        </SmoothButton>
      </div>
    </div>
  );
};

export default PriceFlowDemo;
