"use client";

import type { DropdownMenuItemConfig } from "@repo/smoothui/components/dropdown-menu";
import DropdownMenu from "@repo/smoothui/components/dropdown-menu";
import SmoothButton from "@repo/smoothui/components/smooth-button";

const items: DropdownMenuItemConfig[] = [
  {
    key: "profile",
    label: "Profile",
    onSelect: () => {},
    shortcut: "\u2318P",
  },
  {
    key: "settings",
    label: "Settings",
    onSelect: () => {},
    shortcut: "\u2318,",
  },
  { key: "sep-1", label: "", separator: true },
  {
    children: [
      { key: "invite", label: "Invite Members", onSelect: () => {} },
      { key: "manage", label: "Manage Team", onSelect: () => {} },
    ],
    key: "team",
    label: "Team",
  },
  { key: "sep-2", label: "", separator: true },
  {
    key: "logout",
    label: "Log Out",
    onSelect: () => {},
    shortcut: "\u2318Q",
    variant: "destructive",
  },
];

export default function DropdownMenuDemo() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-8">
      <p className="text-muted-foreground text-sm">
        Click outside the menu to close it.
      </p>
      <DropdownMenu items={items}>
        <SmoothButton type="button" variant="outline">
          Open Menu
        </SmoothButton>
      </DropdownMenu>
    </div>
  );
}
