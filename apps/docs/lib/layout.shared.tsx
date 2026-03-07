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
    links: [
      {
        text: "Docs",
        url: "/docs",
      },
      {
        text: "Community",
        url: "/docs/community",
      },
      {
        text: "Blog",
        url: "/blog",
      },
    ],
  };
}
