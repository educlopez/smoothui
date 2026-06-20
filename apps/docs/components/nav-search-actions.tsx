"use client";

import { ChangelogPopover } from "@docs/components/changelog-popover";
import { NavThemeSwitch } from "@docs/components/nav-theme-switch";
import {
  SearchTrigger,
  type SearchTriggerProps,
} from "fumadocs-ui/layouts/shared/slots/search-trigger";

// Mobile (<md): actions sit next to the compact search icon on the right,
// instead of being pushed into the sidebar drawer.
export function NavSearchTriggerSm(props: SearchTriggerProps) {
  return (
    <div className="flex items-center">
      <ChangelogPopover />
      <NavThemeSwitch />
      <SearchTrigger {...props} />
    </div>
  );
}

// md and up: actions live in the far-right header cluster via the theme-switch
// slot, not attached to the centered search bar.
export function NavDesktopActions() {
  return (
    <div className="flex items-center gap-1">
      <ChangelogPopover />
      <NavThemeSwitch />
    </div>
  );
}
