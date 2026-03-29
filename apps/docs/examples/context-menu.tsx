"use client";

import ContextMenu from "@repo/smoothui/components/context-menu";
import type { ContextMenuItemConfig } from "@repo/smoothui/components/context-menu";

const items: ContextMenuItemConfig[] = [
  {
    key: "back",
    label: "Back",
    shortcut: "⌘[",
    onSelect: () => {},
  },
  {
    key: "forward",
    label: "Forward",
    shortcut: "⌘]",
    disabled: true,
    onSelect: () => {},
  },
  {
    key: "reload",
    label: "Reload",
    shortcut: "⌘R",
    onSelect: () => {},
  },
  { key: "sep-1", separator: true, label: "" },
  {
    key: "more-tools",
    label: "More Tools",
    children: [
      { key: "save-page", label: "Save Page As…", shortcut: "⌘S", onSelect: () => {} },
      { key: "dev-tools", label: "Developer Tools", shortcut: "⌘⌥I", onSelect: () => {} },
    ],
  },
  { key: "sep-2", separator: true, label: "" },
  {
    key: "view-source",
    label: "View Page Source",
    shortcut: "⌘U",
    onSelect: () => {},
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
        <div className="flex h-40 w-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
          Right-click here
        </div>
      </ContextMenu>
    </div>
  );
}
