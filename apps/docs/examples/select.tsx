"use client";

import Select from "@repo/smoothui/components/select";
import { useState } from "react";

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Grape", value: "grape" },
  { label: "Mango", value: "mango" },
  { label: "Orange", value: "orange" },
  { label: "Peach", value: "peach" },
  { label: "Strawberry", value: "strawberry" },
];

const groupedOptions = [
  {
    label: "Fruits",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" },
    ],
  },
  {
    label: "Vegetables",
    options: [
      { label: "Carrot", value: "carrot" },
      { label: "Broccoli", value: "broccoli" },
      { label: "Spinach", value: "spinach" },
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
          aria-label="Fruit selection"
          onValueChange={setValue}
          options={fruits}
          placeholder="Choose a fruit"
          value={value}
        />
        {value ? (
          <p className="text-muted-foreground text-sm">Selected: {value}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Grouped Select</h3>
        <Select
          aria-label="Food selection"
          groups={groupedOptions}
          placeholder="Choose food"
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-medium text-lg">Disabled Select</h3>
        <Select
          aria-label="Disabled selection"
          disabled
          options={fruits}
          placeholder="Not available"
        />
      </div>
    </div>
  );
}
