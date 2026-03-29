"use client";

import { useState } from "react";
import Select from "@repo/smoothui/components/select";

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "grape", label: "Grape" },
  { value: "mango", label: "Mango" },
  { value: "orange", label: "Orange" },
  { value: "peach", label: "Peach" },
  { value: "strawberry", label: "Strawberry" },
];

const groupedOptions = [
  {
    label: "Fruits",
    options: [
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "spinach", label: "Spinach" },
    ],
  },
];

export default function SelectDemo() {
  const [value, setValue] = useState<string>("");

  return (
    <div className="flex w-full max-w-sm flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Basic Select</h3>
        <Select
          options={fruits}
          placeholder="Choose a fruit"
          onValueChange={setValue}
          value={value}
          aria-label="Fruit selection"
        />
        {value && (
          <p className="text-muted-foreground text-sm">
            Selected: {value}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Grouped Select</h3>
        <Select
          groups={groupedOptions}
          placeholder="Choose food"
          aria-label="Food selection"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Disabled Select</h3>
        <Select
          options={fruits}
          placeholder="Not available"
          disabled
          aria-label="Disabled selection"
        />
      </div>
    </div>
  );
}
