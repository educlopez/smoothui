"use client";

import MorphIcon, {
  type MorphIconVariant,
} from "@repo/smoothui/components/morph-icon";
import { useState } from "react";

const MorphIconScene = ({ variant }: { variant: MorphIconVariant }) => {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center justify-center p-8">
      <button
        aria-label={`Toggle ${variant} icon`}
        className="rounded-lg p-3 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-brand"
        onClick={() => setActive((value) => !value)}
        type="button"
      >
        <MorphIcon active={active} size={32} variant={variant} />
      </button>
    </div>
  );
};

const SidebarDemo = () => <MorphIconScene variant="sidebar" />;
const ListDemo = () => <MorphIconScene variant="list" />;
const GridDemo = () => <MorphIconScene variant="grid" />;
const CompactDemo = () => <MorphIconScene variant="compact" />;
const MenuDemo = () => <MorphIconScene variant="menu" />;
const SearchDemo = () => <MorphIconScene variant="search" />;
const PlayDemo = () => <MorphIconScene variant="play" />;
const CheckDemo = () => <MorphIconScene variant="check" />;

export const demoScenes = {
  Check: CheckDemo,
  Compact: CompactDemo,
  Features: SidebarDemo,
  Grid: GridDemo,
  List: ListDemo,
  Menu: MenuDemo,
  Play: PlayDemo,
  Search: SearchDemo,
  Sidebar: SidebarDemo,
};

export default function MorphIconDemo() {
  return <SidebarDemo />;
}
