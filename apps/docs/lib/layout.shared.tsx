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
    // Search + changelog live in the header right cluster (search, then
    // notifications furthest right). Compact search icon on mobile
    // (searchTrigger.sm); full field on desktop (searchTrigger.full) via
    // DocsHeader. Theme toggling lives only in FloatNav.
    slots: {
      searchTrigger: {
        full: FullSearchTrigger,
        sm: NavSearchTriggerSm,
      },
      themeSwitch: NavDesktopActions,
    },
  };
}
