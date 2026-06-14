import { ChangelogPopover } from "@docs/components/changelog-popover";
import Logo from "@docs/components/logo";
import { NavThemeSwitch } from "@docs/components/nav-theme-switch";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    themeSwitch: {
      enabled: false,
    },
    nav: {
      title: <Logo />,
    },
    links: [
      {
        type: "custom",
        children: (
          <div className="flex items-center gap-2">
            <ChangelogPopover />
            <NavThemeSwitch />
          </div>
        ),
      },
    ],
  };
}
