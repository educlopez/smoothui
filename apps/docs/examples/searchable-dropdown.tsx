"use client";

import SearchableDropdown from "@repo/smoothui/components/searchable-dropdown";
import { Globe, Monitor, Smartphone, Tablet, Tv, Watch } from "lucide-react";

const devices = [
  {
    id: 1,
    label: "Desktop",
    description: "Windows, Mac, Linux",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    id: 2,
    label: "Laptop",
    description: "Portable computer",
    icon: <Monitor className="h-4 w-4" />,
  },
  {
    id: 3,
    label: "Tablet",
    description: "iPad, Android tablets",
    icon: <Tablet className="h-4 w-4" />,
  },
  {
    id: 4,
    label: "Smartphone",
    description: "iPhone, Android phones",
    icon: <Smartphone className="h-4 w-4" />,
  },
  {
    id: 5,
    label: "Smart TV",
    description: "Connected television",
    icon: <Tv className="h-4 w-4" />,
  },
  {
    id: 6,
    label: "Smartwatch",
    description: "Wearable device",
    icon: <Watch className="h-4 w-4" />,
  },
  {
    id: 7,
    label: "Web Browser",
    description: "Any platform",
    icon: <Globe className="h-4 w-4" />,
  },
];

export default function SearchableDropdownDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 p-8">
      <h3 className="font-medium text-lg">Select a device</h3>
      <SearchableDropdown
        items={devices}
        label="Choose a device"
        placeholder="Search devices..."
        emptyMessage="No devices found"
      />
    </div>
  );
}
