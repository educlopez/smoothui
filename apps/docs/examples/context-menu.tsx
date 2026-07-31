"use client";

import type { ContextMenuItemConfig } from "@repo/smoothui/components/context-menu";
import ContextMenu from "@repo/smoothui/components/context-menu";

const items: ContextMenuItemConfig[] = [
  {
    key: "back",
    label: "Back",
    onSelect: () => {},
    shortcut: "⌘[",
  },
  {
    disabled: true,
    key: "forward",
    label: "Forward",
    onSelect: () => {},
    shortcut: "⌘]",
  },
  {
    key: "reload",
    label: "Reload",
    onSelect: () => {},
    shortcut: "⌘R",
  },
  { key: "sep-1", label: "", separator: true },
  {
    children: [
      {
        key: "save-page",
        label: "Save Page As…",
        onSelect: () => {},
        shortcut: "⌘S",
      },
      {
        key: "dev-tools",
        label: "Developer Tools",
        onSelect: () => {},
        shortcut: "⌘⌥I",
      },
    ],
    key: "more-tools",
    label: "More Tools",
  },
  { key: "sep-2", label: "", separator: true },
  {
    key: "view-source",
    label: "View Page Source",
    onSelect: () => {},
    shortcut: "⌘U",
  },
  {
    key: "inspect",
    label: "Inspect Element",
    onSelect: () => {},
  },
];

export default function ContextMenuDemo() {
  return (
    <div className="flex w-full items-center justify-center p-8">
      <ContextMenu items={items}>
        <div className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed text-muted-foreground text-sm">
          Right-click here
        </div>
      </ContextMenu>
    </div>
  );
}
