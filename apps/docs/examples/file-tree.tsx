"use client";

import type { FileTreeItem } from "@repo/smoothui/components/file-tree";
import FileTree from "@repo/smoothui/components/file-tree";
import { useState } from "react";

const items: FileTreeItem[] = [
  {
    children: [
      {
        children: [
          { id: "button", name: "button.tsx", type: "file" },
          { id: "card", name: "card.tsx", type: "file" },
        ],
        id: "components",
        name: "components",
        type: "folder",
      },
      { id: "layout", name: "layout.tsx", type: "file" },
      { id: "page", name: "page.tsx", type: "file" },
    ],
    id: "app",
    name: "app",
    type: "folder",
  },
  {
    children: [
      { id: "utils", name: "utils.ts", type: "file" },
      { id: "hooks", name: "use-toggle.ts", type: "file" },
    ],
    id: "lib",
    name: "lib",
    type: "folder",
  },
  { badge: "new", id: "readme", name: "README.md", type: "file" },
  { id: "package", name: "package.json", type: "file" },
];

export default function FileTreeDemo() {
  const [selected, setSelected] = useState<string | undefined>("page");

  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-border bg-background p-3">
      <FileTree
        defaultExpanded={["app", "components"]}
        items={items}
        onSelectedChange={setSelected}
        selected={selected}
        showLines
      />
    </div>
  );
}
