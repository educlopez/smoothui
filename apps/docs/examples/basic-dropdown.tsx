"use client";

import BasicDropdown from "@repo/smoothui/components/basic-dropdown";

const items = [
  { id: 1, label: "Small" },
  { id: 2, label: "Medium" },
  { id: 3, label: "Large" },
  { id: 4, label: "Extra Large" },
];

export default function BasicDropdownDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 p-8">
      <h3 className="font-medium text-lg">Select a size</h3>
      <BasicDropdown items={items} label="Choose a size" />
    </div>
  );
}
