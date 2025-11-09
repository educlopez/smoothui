import Logo from "@docs/components/logo";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
export function baseOptions(): BaseLayoutProps {
  return {
    themeSwitch: {
      enabled: false,
    },
    nav: {
      title: <Logo />,
    },
  };
}
