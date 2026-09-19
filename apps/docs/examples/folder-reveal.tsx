"use client";

import type { FolderRevealItem } from "@repo/smoothui/components/folder-reveal";
import FolderReveal from "@repo/smoothui/components/folder-reveal";
import { useState } from "react";

const FOLDER_SIZE = 200;

type FileSpec = {
  id: string;
  lines: number[];
  name: string;
  size: string;
  tint: string;
};

const FileCard = ({ lines, name, size, tint }: Omit<FileSpec, "id">) => (
  <div className="flex h-full flex-col">
    <div
      className="flex flex-1 flex-col gap-1 p-2"
      style={{ background: tint }}
    >
      {lines.map((width, index) => (
        <div
          className="h-[3px] rounded-full bg-foreground/15"
          key={`${name}-line-${index}`}
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

const toItems = (files: FileSpec[]): FolderRevealItem[] =>
  files.map((file) => ({
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

const PAPER = "oklch(0.985 0.004 90)";

const invoices: FileSpec[] = [
  {
    id: "inv-q1",
    lines: [90, 74, 82, 58],
    name: "Invoice Q1.pdf",
    size: "248 KB",
    tint: PAPER,
  },
  {
    id: "inv-q2",
    lines: [86, 62, 78, 70],
    name: "Invoice Q2.pdf",
    size: "312 KB",
    tint: PAPER,
  },
  {
    id: "receipts",
    lines: [72, 88, 54, 80],
    name: "Receipts.xlsx",
    size: "1.2 MB",
    tint: "oklch(0.975 0.014 150)",
  },
];

const brand: FileSpec[] = [
  {
    id: "logo",
    lines: [64, 88, 46],
    name: "Logo marks.fig",
    size: "4.8 MB",
    tint: "oklch(0.96 0.03 352)",
  },
  {
    id: "type",
    lines: [92, 70, 84, 60],
    name: "Typography.pdf",
    size: "820 KB",
    tint: PAPER,
  },
  {
    id: "guide",
    lines: [78, 86, 62, 74],
    name: "Guidelines.md",
    size: "36 KB",
    tint: PAPER,
  },
];

const photos: FileSpec[] = [
  {
    id: "shoot-01",
    lines: [88, 66, 78],
    name: "Shoot 01.raw",
    size: "24.6 MB",
    tint: "oklch(0.95 0.03 250)",
  },
  {
    id: "shoot-02",
    lines: [72, 90, 58, 66],
    name: "Shoot 02.raw",
    size: "22.1 MB",
    tint: "oklch(0.95 0.03 250)",
  },
  {
    id: "selects",
    lines: [84, 60, 90],
    name: "Selects.zip",
    size: "108 MB",
    tint: "oklch(0.96 0.025 200)",
  },
];

export default function FolderRevealDemo() {
  const [brandOpen, setBrandOpen] = useState(true);

  return (
    <div className="flex w-full items-center justify-center gap-5 py-12 sm:gap-7">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-[228px] items-end">
          <FolderReveal
            items={toItems(invoices)}
            label="Invoices"
            size={FOLDER_SIZE}
            trigger="hover"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">Hover to open</p>
      </div>

      <div className="hidden flex-col items-center gap-3 sm:flex">
        <div className="flex h-[228px] items-end">
          <FolderReveal
            color="brand"
            items={toItems(brand)}
            label="Brand"
            onOpenChange={setBrandOpen}
            open={brandOpen}
            size={FOLDER_SIZE}
            trigger="click"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">Controlled — click</p>
      </div>

      <div className="hidden flex-col items-center gap-3 md:flex">
        <div className="flex h-[228px] items-end">
          <FolderReveal
            color="blue"
            items={toItems(photos)}
            label="Photos"
            rotation={9}
            size={FOLDER_SIZE}
            spread={58}
            trigger="click"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">Click to toggle</p>
      </div>
    </div>
  );
}
