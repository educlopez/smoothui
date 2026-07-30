import DocsFooter from "@docs/components/docs-footer";
import { FloatNav } from "@docs/components/float-nav";
import { NavSponsorCard } from "@docs/components/nav-sponsor-card";
import { decorateNewPages } from "@docs/lib/decorate-new";
import { baseOptions } from "@docs/lib/layout.shared";
import { source } from "@docs/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree = decorateNewPages(source.pageTree, source);
  const options = baseOptions();

  return (
    <DocsLayout
      tree={tree}
      {...options}
      containerProps={{
        style: { "--fd-layout-width": "100%" } as React.CSSProperties,
      }}
      nav={{ ...options.nav, mode: "top" }}
      sidebar={{
        // Collapsible so component and block pages can start with it closed and
        // reach it as an overlay — the stage there is worth more than a permanent
        // 240px column. Prose pages keep it open; see SplitDocsChrome.
        collapsible: true,
        footer: <NavSponsorCard key="nav-sponsor-card" />,
      }}
      tabMode="navbar"
    >
      {children}
      <FloatNav key="float-nav" />
      {/* SEO footer inside the scroll flow, spanning the full grid width
          so it lands at the bottom without breaking the 100dvh layout.
          DocsFooter constrains its content to the main column band. */}
      <div
        className="[grid-column:1/-1]"
        data-docs-seo-footer
        key="docs-footer"
      >
        <DocsFooter />
      </div>
    </DocsLayout>
  );
}
