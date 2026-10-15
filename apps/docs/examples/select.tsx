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

const BasicDemo = () => {
  const [value, setValue] = useState<string>("");

  return (
    <div className="flex w-full max-w-sm items-center justify-center p-8">
      <Select
        aria-label="Fruit"
        onValueChange={setValue}
        options={fruits}
        placeholder="Choose a fruit"
        value={value}
      />
    </div>
  );
};

const GroupedDemo = () => (
  <div className="flex w-full max-w-sm items-center justify-center p-8">
    <Select
      aria-label="Food"
      groups={groupedOptions}
      placeholder="Choose food"
    />
  </div>
);

const DisabledDemo = () => (
  <div className="flex w-full max-w-sm items-center justify-center p-8">
    <Select
      aria-label="Unavailable"
      disabled
      options={fruits}
      placeholder="Not available"
    />
  </div>
);

export const demoScenes = {
  Basic: BasicDemo,
  Disabled: DisabledDemo,
  Features: BasicDemo,
  Grouped: GroupedDemo,
};

export default function SelectDemo() {
  return <BasicDemo />;
}
