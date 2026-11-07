import { DocsFloatNav } from "@docs/components/docs-float-nav";
import DocsFooter from "@docs/components/docs-footer";
import { DocsHeader } from "@docs/components/docs-header";
import { DocsSidebarItem } from "@docs/components/docs-sidebar-item";
import { NavSponsorCard } from "@docs/components/nav-sponsor-card";
import { decorateNewPages } from "@docs/lib/decorate-new";
import { decorateSidebarCategories } from "@docs/lib/decorate-sidebar-categories";
import { injectPlannedPrimitives } from "@docs/lib/inject-planned-primitives";
import { baseOptions } from "@docs/lib/layout.shared";
import { source } from "@docs/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree = decorateSidebarCategories(
    injectPlannedPrimitives(decorateNewPages(source.pageTree, source))
  );
  const options = baseOptions();

  return (
    <>
      {/* First tab stop: jumps past the header and the long sidebar. */}
      <a
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:font-medium focus:text-foreground focus:text-sm focus:shadow-md"
        href="#nd-page"
      >
        Skip to content
      </a>
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
          components: {
            Item: DocsSidebarItem,
          },
          footer: <NavSponsorCard key="nav-sponsor-card" />,
        }}
        slots={{
          ...options.slots,
          // Custom header: section tabs + right-side search/changelog in one row.
          header: DocsHeader,
        }}
        tabMode="navbar"
      >
        {children}
        <DocsFloatNav key="float-nav" />
        {/* SEO footer inside the scroll flow, spanning the full grid width so it
          lands at the bottom without breaking the 100dvh layout. DocsFooter
          constrains its content to the main column band.

          The row is pinned to the last explicit grid line rather than left to
          auto-placement: as a full-width item with no row of its own, the
          browser dropped it into the first gap it fitted — above `main` — and on
          narrow screens the whole footer rendered before the page content. */}
        <div
          className="[grid-column:1/-1] [grid-row-start:-1]"
          data-docs-seo-footer
          key="docs-footer"
        >
          <DocsFooter />
        </div>
      </DocsLayout>
    </>
  );
}
