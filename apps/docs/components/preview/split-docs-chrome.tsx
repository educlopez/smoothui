"use client";

import { useEffect } from "react";

/**
 * Page-scoped chrome changes for split component/block pages.
 *
 * One thing happens here, undone on the way out so the rest of the docs is
 * untouched. The sidebar stays docked and takes its column like on every other
 * docs page, rather than starting collapsed as a floating overlay.
 *
 * The layout's full-width SEO footer is hidden, because this page renders its
 *    own copy at the end of the reading column, next to the prev/next links,
 *    instead of spanning underneath the stage. It is hidden imperatively rather
 *    than with a global CSS rule: the footer belongs to the layout, so the page
 *    owns the exception for exactly as long as it is mounted, and there is no
 *    stylesheet rule left behind to explain later.
 */
export type SplitDocsChromeProps = {
  /**
   * Split pages render their own footer at the end of the reading column, so the
   * layout's copy would be a duplicate. Block pages are stacked and keep it.
   */
  hideLayoutFooter?: boolean;
};

export const SplitDocsChrome = ({
  hideLayoutFooter = true,
}: SplitDocsChromeProps) => {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.splitDocs = "true";

    const layoutFooter = hideLayoutFooter
      ? document.querySelector<HTMLElement>("[data-docs-seo-footer]")
      : null;
    const previousDisplay = layoutFooter?.style.display ?? "";
    if (layoutFooter) {
      layoutFooter.style.display = "none";
    }

    return () => {
      delete root.dataset.splitDocs;
      if (layoutFooter) {
        layoutFooter.style.display = previousDisplay;
      }
    };
  }, [hideLayoutFooter]);

  return null;
};
