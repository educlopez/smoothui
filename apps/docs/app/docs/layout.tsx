import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { FloatNav } from "../../components/float-nav";
import { NavSponsorCard } from "../../components/nav-sponsor-card";
import { baseOptions } from "../../lib/layout.shared";
import { source } from "../../lib/source";

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
