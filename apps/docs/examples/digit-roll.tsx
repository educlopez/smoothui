"use client";

import DigitRoll from "@repo/smoothui/components/digit-roll";
import { useState } from "react";

export default function DigitRollDemo() {
  const [quantity, setQuantity] = useState(3);
  const [price, setPrice] = useState(24.5);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-4 py-8">
      <DigitRoll
        label="Quantity"
        max={99}
        min={0}
        onValueChange={setQuantity}
        stepper
        value={quantity}
      />
      <DigitRoll
        label="Price"
        max={500}
        min={0}
        onValueChange={setPrice}
        precision={2}
        prefix="$"
        step={0.5}
        value={price}
      />
      <DigitRoll
        defaultValue={68}
        label="Volume"
        max={100}
        min={0}
        suffix="%"
      />
    </div>
  );
}
