import Logo from "@docs/components/logo";
import {
  NavDesktopActions,
  NavSearchTriggerSm,
} from "@docs/components/nav-search-actions";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { FullSearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
    },
    // Keep the changelog + theme actions next to the search/menu controls:
    // beside the compact search icon on mobile (searchTrigger.sm), and in the
    // far-right header cluster on desktop (themeSwitch slot). This keeps them
    // out of the mobile sidebar drawer.
    slots: {
      searchTrigger: {
        sm: NavSearchTriggerSm,
        full: FullSearchTrigger,
      },
      themeSwitch: NavDesktopActions,
    },
  };
}
