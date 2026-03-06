import { FloatNav } from "@docs/components/float-nav";
import { NavSponsorCard } from "@docs/components/nav-sponsor-card";
import { baseOptions } from "@docs/lib/layout.shared";
import { source } from "@docs/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions()}
      sidebar={{
        footer: <NavSponsorCard />,
      }}
    >
      {children}
      <FloatNav />
    </DocsLayout>
  );
}
