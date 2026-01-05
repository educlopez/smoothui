import { FloatNav } from "@docs/components/float-nav";
import { NavSponsorCard } from "@docs/components/nav-sponsor-card";
import { SidebarEnhancer } from "@docs/components/sidebar-enhancer";
import { baseOptions } from "@docs/lib/layout.shared";
import { getRecentlyModifiedPagesWithLabels, source } from "@docs/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default function Layout({ children }: LayoutProps<"/docs">) {
  // Get recently modified pages with labels (last 7 days)
  const recentPagesMap = getRecentlyModifiedPagesWithLabels();

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
      <SidebarEnhancer recentPagesMap={recentPagesMap} />
    </DocsLayout>
  );
}
