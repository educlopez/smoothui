"use client";

import DropdownMenu from "@repo/smoothui/components/dropdown-menu";
import type { DropdownMenuItemConfig } from "@repo/smoothui/components/dropdown-menu";
import SmoothButton from "@repo/smoothui/components/smooth-button";

const items: DropdownMenuItemConfig[] = [
  {
    key: "profile",
    label: "Profile",
    shortcut: "\u2318P",
    onSelect: () => {},
  },
  {
    key: "settings",
    label: "Settings",
    shortcut: "\u2318,",
    onSelect: () => {},
  },
  { key: "sep-1", separator: true, label: "" },
  {
    key: "team",
    label: "Team",
    children: [
      { key: "invite", label: "Invite Members", onSelect: () => {} },
      { key: "manage", label: "Manage Team", onSelect: () => {} },
    ],
  },
  { key: "sep-2", separator: true, label: "" },
  {
    key: "logout",
    label: "Log Out",
    shortcut: "\u2318Q",
    variant: "destructive",
    onSelect: () => {},
  },
];

export default function DropdownMenuDemo() {
  return (
    <div className="flex w-full items-center justify-center p-8">
      <DropdownMenu items={items}>
        <SmoothButton variant="outline" type="button">
          Open Menu
        </SmoothButton>
      </DropdownMenu>
    </div>
  );
}
