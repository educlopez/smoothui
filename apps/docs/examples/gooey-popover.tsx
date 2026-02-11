"use client";

import GooeyPopover from "@repo/smoothui/components/gooey-popover";

export default function GooeyPopoverDemo() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-end gap-8 p-8 pb-16">
      <GooeyPopover contentWidth={260}>
        <div className="flex flex-col gap-3">
          <p className="font-medium text-sm text-white/90">
            This popover uses an SVG goo filter to create a viscous blob
            morphing effect between the trigger and content panel.
          </p>
          <div className="flex gap-2">
            <button
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/20"
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-lg bg-white px-3 py-1.5 text-neutral-900 text-sm transition-colors hover:bg-white/90"
              type="button"
            >
              Confirm
            </button>
          </div>
        </div>
      </GooeyPopover>
    </div>
  );
}
