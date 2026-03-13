import { FloatNav } from "@docs/components/float-nav";
import { NavSponsorCard } from "@docs/components/nav-sponsor-card";
import { decorateNewPages } from "@docs/lib/decorate-new";
import { baseOptions } from "@docs/lib/layout.shared";
import { source } from "@docs/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree = decorateNewPages(source.pageTree, source);

  return (
    <DocsLayout
      tree={tree}
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
