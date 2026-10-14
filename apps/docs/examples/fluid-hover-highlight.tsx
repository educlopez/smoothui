"use client";

import FluidHoverHighlight from "@repo/smoothui/components/fluid-hover-highlight";
import {
  useFluidHover,
  useRegisterFluidHoverItem,
} from "@repo/smoothui/hooks/use-fluid-hover";
import { useRef } from "react";

const ITEMS = ["Inbox", "Drafts", "Sent", "Archive", "Trash"];

export default function FluidHoverHighlightDemo() {
  const containerRef = useRef<HTMLUListElement>(null);
  const hover = useFluidHover(containerRef);

  return (
    <div className="flex w-full items-center justify-center p-8">
      <ul
        aria-label="Folders"
        className="relative w-full max-w-xs rounded-xl border border-foreground/10 bg-background p-1"
        ref={containerRef}
        {...hover.handlers}
      >
        <FluidHoverHighlight
          className="z-0 rounded-lg bg-foreground/5"
          hover={hover}
        />
        {ITEMS.map((label, index) => (
          <FluidHoverRow
            hover={hover}
            index={index}
            key={label}
            label={label}
          />
        ))}
      </ul>
    </div>
  );
}

const FluidHoverRow = ({
  hover,
  index,
  label,
}: {
  hover: ReturnType<typeof useFluidHover>;
  index: number;
  label: string;
}) => {
  const itemRef = useRef<HTMLLIElement>(null);
  useRegisterFluidHoverItem(hover.registerItem, index, itemRef);

  return (
    <li className="relative z-10" ref={itemRef}>
      <button
        className="flex w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm"
        type="button"
      >
        {label}
      </button>
    </li>
  );
};
