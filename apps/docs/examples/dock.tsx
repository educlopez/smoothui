"use client";

import type { DockItem } from "@repo/smoothui/components/dock";
import Dock from "@repo/smoothui/components/dock";
import {
  Aperture,
  Calendar,
  Compass,
  Folder,
  Mail,
  MessageCircle,
  Music,
  Settings,
  Sparkles,
  Terminal,
  Trash2,
} from "lucide-react";
import { type ReactNode, useState } from "react";

type TileProps = {
  children: ReactNode;
  from: string;
  to: string;
};

const AppTile = ({ children, from, to }: TileProps) => (
  <span
    className="flex size-full items-center justify-center rounded-[26%] text-white shadow-black/25 shadow-sm ring-1 ring-white/25 ring-inset"
    style={{ backgroundImage: `linear-gradient(to bottom, ${from}, ${to})` }}
  >
    {children}
  </span>
);

const ICON = "size-5";
const SIDE_ICON = "size-4";

export default function DockDemo() {
  const [openApp, setOpenApp] = useState("Finder");

  const items: DockItem[] = [
    {
      active: true,
      icon: (
        <AppTile from="oklch(0.72 0.13 240)" to="oklch(0.56 0.16 250)">
          <Folder className={ICON} />
        </AppTile>
      ),
      id: "finder",
      label: "Finder",
      onSelect: () => setOpenApp("Finder"),
    },
    {
      active: true,
      icon: (
        <AppTile from="oklch(0.74 0.14 205)" to="oklch(0.58 0.16 215)">
          <Mail className={ICON} />
        </AppTile>
      ),
      id: "mail",
      label: "Mail",
      onSelect: () => setOpenApp("Mail"),
    },
    {
      icon: (
        <AppTile from="oklch(0.76 0.16 150)" to="oklch(0.6 0.17 155)">
          <MessageCircle className={ICON} />
        </AppTile>
      ),
      id: "messages",
      label: "Messages",
      onSelect: () => setOpenApp("Messages"),
    },
    {
      icon: (
        <AppTile from="oklch(0.7 0.2 25)" to="oklch(0.55 0.21 20)">
          <Calendar className={ICON} />
        </AppTile>
      ),
      id: "calendar",
      label: "Calendar",
      onSelect: () => setOpenApp("Calendar"),
    },
    {
      active: true,
      icon: (
        <AppTile from="oklch(0.74 0.19 352)" to="oklch(0.6 0.21 354)">
          <Music className={ICON} />
        </AppTile>
      ),
      id: "music",
      label: "Music",
      onSelect: () => setOpenApp("Music"),
    },
    {
      icon: (
        <AppTile from="oklch(0.82 0.16 80)" to="oklch(0.68 0.17 62)">
          <Aperture className={ICON} />
        </AppTile>
      ),
      id: "photos",
      label: "Photos",
      onSelect: () => setOpenApp("Photos"),
    },
    {
      icon: (
        <AppTile from="oklch(0.68 0.18 300)" to="oklch(0.53 0.19 295)">
          <Sparkles className={ICON} />
        </AppTile>
      ),
      id: "studio",
      label: "Studio",
      onSelect: () => setOpenApp("Studio"),
    },
    {
      icon: (
        <AppTile from="oklch(0.4 0.01 260)" to="oklch(0.24 0.01 260)">
          <Terminal className={ICON} />
        </AppTile>
      ),
      id: "terminal",
      label: "Terminal",
      onSelect: () => setOpenApp("Terminal"),
    },
    {
      icon: (
        <AppTile from="oklch(0.66 0.03 265)" to="oklch(0.5 0.03 265)">
          <Settings className={ICON} />
        </AppTile>
      ),
      id: "settings",
      label: "System settings",
      onSelect: () => setOpenApp("System settings"),
    },
  ];

  const sideItems: DockItem[] = [
    {
      active: true,
      icon: (
        <AppTile from="oklch(0.72 0.13 240)" to="oklch(0.56 0.16 250)">
          <Folder className={SIDE_ICON} />
        </AppTile>
      ),
      id: "files",
      label: "Files",
    },
    {
      icon: (
        <AppTile from="oklch(0.74 0.14 205)" to="oklch(0.58 0.16 215)">
          <Compass className={SIDE_ICON} />
        </AppTile>
      ),
      id: "browser",
      label: "Browser",
    },
    {
      icon: (
        <AppTile from="oklch(0.82 0.16 80)" to="oklch(0.68 0.17 62)">
          <Aperture className={SIDE_ICON} />
        </AppTile>
      ),
      id: "capture",
      label: "Capture",
    },
    {
      icon: (
        <AppTile from="oklch(0.66 0.03 265)" to="oklch(0.5 0.03 265)">
          <Trash2 className={SIDE_ICON} />
        </AppTile>
      ),
      id: "bin",
      label: "Bin",
    },
  ];

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-foreground/10">
      <img
        alt="A green mountain ridge falling away under a heavy sky"
        className="absolute inset-0 size-full select-none object-cover"
        draggable={false}
        src="https://picsum.photos/id/1018/2400/1400"
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
