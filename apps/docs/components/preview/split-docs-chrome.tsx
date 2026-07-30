"use client";

import { useSidebar } from "fumadocs-ui/components/sidebar/base";
import { useEffect } from "react";

/**
 * Page-scoped chrome changes for split component/block pages.
 *
 * Two things happen here, both undone on the way out so the rest of the docs is
 * untouched:
 *
 * 1. The sidebar starts collapsed. On a split page the stage already owns half the
 *    width, and the catalogue is a jump list you reach for occasionally — not
 *    something worth a permanent 240px column. Guides and other prose pages keep
 *    it open, because there navigation *is* the context.
 * 2. The layout's full-width SEO footer is hidden, because this page renders its
 *    own copy at the end of the reading column, next to the prev/next links,
 *    instead of spanning underneath the stage. It is hidden imperatively rather
 *    than with a global CSS rule: the footer belongs to the layout, so the page
 *    owns the exception for exactly as long as it is mounted, and there is no
 *    stylesheet rule left behind to explain later.
 */
export const SplitDocsChrome = () => {
  const { setCollapsed } = useSidebar();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.splitDocs = "true";
    setCollapsed(true);

    const layoutFooter = document.querySelector<HTMLElement>(
      "[data-docs-seo-footer]"
    );
    const previousDisplay = layoutFooter?.style.display ?? "";
    if (layoutFooter) {
      layoutFooter.style.display = "none";
    }

    return () => {
      delete root.dataset.splitDocs;
      setCollapsed(false);
      if (layoutFooter) {
        layoutFooter.style.display = previousDisplay;
      }
    };
  }, [setCollapsed]);

  return null;
};

export default SplitDocsChrome;
