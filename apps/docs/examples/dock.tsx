"use client";

import type { DockItem } from "@repo/smoothui/components/dock";
import Dock from "@repo/smoothui/components/dock";
import type { AppIcon } from "@smoothui/data/app-icons";
import { appIconById, dockIcons } from "@smoothui/data/app-icons";
import { useState } from "react";

const appIcon = (app: AppIcon, size: number) => (
  <img
    alt=""
    className="size-full rounded-[22%]"
    draggable={false}
    src={`${app.src}?tr=w-${size}`}
  />
);

export default function DockDemo() {
  const [openApp, setOpenApp] = useState("Finder");

  const items: DockItem[] = dockIcons.map((app, index) => ({
    // The first two read as "running" — a dock with nothing open looks staged.
    active: index < 2,
    icon: appIcon(app, 128),
    id: app.id,
    label: app.name,
    onSelect: () => setOpenApp(app.name),
  }));

  const sideItems: DockItem[] = [
    "safari",
    "photos",
    "screenshot",
    "time-machine",
  ]
    .map((id) => appIconById(id))
    .filter((app): app is AppIcon => app !== undefined)
    .map((app, index) => ({
      active: index === 0,
      icon: appIcon(app, 96),
      id: app.id,
      label: app.name,
    }));

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-foreground/10">
      <img
        alt="A green mountain ridge falling away under a heavy sky"
        className="absolute inset-0 size-full select-none object-cover"
        draggable={false}
        src="https://ik.imagekit.io/16u211libb/smoothui/backgrounds/mountain-ridge.jpg?tr=w-1600,f-auto"
      />
      {/* Scrim: darkest at the two edges the chrome sits on, so the menu bar
          and the dock keep their contrast whatever the photo is doing. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(0_0_0/0.55)_0%,rgb(0_0_0/0.1)_28%,rgb(0_0_0/0.15)_62%,rgb(0_0_0/0.6)_100%)] bg-black/25"
      />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-white/10 border-b bg-white/10 py-1.5 pr-1.5 pl-4 text-[11px] text-white/85 backdrop-blur-md">
        <span className="font-semibold tracking-tight">{openApp}</span>
        <span className="pr-2 tabular-nums">9:41</span>
      </div>

      <div className="absolute inset-x-0 top-20 flex flex-col items-center gap-1.5 px-8 text-center">
        <p className="font-medium text-2xl text-white tracking-tight">
          {openApp}
        </p>
        <p className="max-w-sm text-[13px] text-white/65">
          The icons either side of the cursor grow too, tapering off over three
          tiles. Click one to bounce it.
        </p>
      </div>

      <div className="absolute top-1/2 right-1 -translate-y-1/2">
        <Dock
          baseSize={40}
          distance={140}
          items={sideItems}
          magnification={1.45}
          orientation="vertical"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <Dock items={items} />
      </div>
    </div>
  );
}
