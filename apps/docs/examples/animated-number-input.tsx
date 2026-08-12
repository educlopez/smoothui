"use client";

import AnimatedNumberInput from "@repo/smoothui/components/animated-number-input";
import { useState } from "react";

export default function AnimatedNumberInputDemo() {
  const [quantity, setQuantity] = useState(3);
  const [price, setPrice] = useState(24.5);

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 px-4 py-8">
      <AnimatedNumberInput
        label="Quantity"
        max={99}
        min={0}
        onValueChange={setQuantity}
        stepper
        value={quantity}
      />
      <AnimatedNumberInput
        label="Price"
        max={500}
        min={0}
        onValueChange={setPrice}
        precision={2}
        prefix="$"
        step={0.5}
        value={price}
      />
      <AnimatedNumberInput
        defaultValue={68}
        label="Volume"
        max={100}
        min={0}
        suffix="%"
      />
    </div>
  );
}
