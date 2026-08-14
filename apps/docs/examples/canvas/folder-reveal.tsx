"use client";

import type { FolderRevealItem } from "@repo/smoothui/components/folder-reveal";
import FolderReveal from "@repo/smoothui/components/folder-reveal";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Held open long enough to read the fan, shut long enough to miss it. */
const TOGGLE_MS = 1900;
const FOLDER_SIZE = 190;

const PAPER = "oklch(0.985 0.004 90)";

type FileSpec = {
  id: string;
  lines: number[];
  name: string;
  size: string;
  tint: string;
};

const files: FileSpec[] = [
  {
    id: "contract",
    lines: [90, 74, 82, 58],
    name: "Contract.pdf",
    size: "248 KB",
    tint: PAPER,
  },
  {
    id: "budget",
    lines: [72, 88, 54, 80],
    name: "Budget.xlsx",
    size: "1.2 MB",
    tint: "oklch(0.975 0.014 150)",
  },
  {
    id: "moodboard",
    lines: [64, 88, 46, 70],
    name: "Moodboard.fig",
    size: "4.8 MB",
    tint: "oklch(0.96 0.03 352)",
  },
];

const FileCard = ({ lines, name, size, tint }: Omit<FileSpec, "id">) => (
  <div className="flex h-full flex-col">
    <div
      className="flex flex-1 flex-col gap-1 p-2"
      style={{ background: tint }}
    >
      {lines.map((width) => (
        <div
          className="h-[3px] rounded-full bg-foreground/15"
          key={`${name}-${width}`}
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
    <div className="border-foreground/10 border-t bg-background px-2 py-1">
      <p className="truncate font-medium text-[9px] text-foreground leading-tight">
        {name}
      </p>
      <p className="text-[8px] text-muted-foreground tabular-nums">{size}</p>
    </div>
  </div>
);

const items: FolderRevealItem[] = files.map((file) => ({
  content: (
    <FileCard
      lines={file.lines}
      name={file.name}
      size={file.size}
      tint={file.tint}
    />
  ),
  id: file.id,
}));

/**
 * Folder-reveal is normally a hover trick. Here `open` is controlled and put on
 * a timer, so the fan spreads and folds on its own; `trigger="click"` keeps the
 * component's own hover handling out of the way.
 */
const FolderRevealCanvasDemo = () => {
  const shouldReduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }
    const timer = setInterval(() => {
      setOpen((current) => !current);
    }, TOGGLE_MS);
    return () => clearInterval(timer);
  }, [shouldReduceMotion]);

  return (
    // items-end plus the padding leaves headroom for the fan and the contact
    // shadow, both of which live outside the folder's own box.
    <div className="flex h-[228px] w-[230px] items-end justify-center pb-6">
      <FolderReveal
        items={items}
        label="Q3 Brief"
        open={open}
        rotation={8}
        size={FOLDER_SIZE}
        spread={50}
        trigger="click"
      />
    </div>
  );
};

export default FolderRevealCanvasDemo;
