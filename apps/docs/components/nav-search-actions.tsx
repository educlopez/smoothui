"use client";

import { ChangelogPopover } from "@docs/components/changelog-popover";
import {
  SearchTrigger,
  type SearchTriggerProps,
} from "fumadocs-ui/layouts/shared/slots/search-trigger";

// Mobile (<md): the changelog bell sits next to the compact search icon on
// the right, instead of being pushed into the sidebar drawer. Theme toggling
// lives only in the FloatNav to avoid a duplicate control.
export function NavSearchTriggerSm(props: SearchTriggerProps) {
  return (
    <div className="flex items-center">
      <ChangelogPopover />
      <SearchTrigger {...props} />
    </div>
  );
}

// md and up: the changelog bell lives in the far-right header cluster via the
// theme-switch slot, not attached to the centered search bar. Theme toggling
// lives only in the FloatNav to avoid a duplicate control.
export function NavDesktopActions() {
  return (
    <div className="flex items-center gap-1">
      <ChangelogPopover />
    </div>
  );
}
