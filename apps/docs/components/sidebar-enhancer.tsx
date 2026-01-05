"use client";

import { useEffect } from "react";

interface SidebarEnhancerProps {
  recentPagesMap: Record<string, string>;
}

/**
 * Client-side component that enhances the Fumadocs sidebar
 * by adding recent modification indicators to links
 */
export function SidebarEnhancer({ recentPagesMap }: SidebarEnhancerProps) {
  useEffect(() => {
    const addIndicators = () => {
      // Try multiple selectors to find sidebar links
      let sidebarLinks = document.querySelectorAll(
        '[data-sidebar] a[href^="/docs"]'
      );

      // Fallback selectors if the first one doesn't work
      if (sidebarLinks.length === 0) {
        sidebarLinks = document.querySelectorAll('aside a[href^="/docs"]');
      }

      if (sidebarLinks.length === 0) {
        sidebarLinks = document.querySelectorAll('nav a[href^="/docs"]');
      }

      for (const link of sidebarLinks) {
        const href = link.getAttribute("href");

        if (!href) continue;

        // Check if this URL is in our recent pages object
        if (href in recentPagesMap) {
          // Check if indicator already exists
          if (link.querySelector("[data-recent-indicator]")) continue;

          // Get modification label
          const modificationLabel = recentPagesMap[href] || "Recently updated";

          // Create indicator wrapper
          const indicatorWrapper = document.createElement("span");
          indicatorWrapper.setAttribute("data-recent-indicator", "true");
          indicatorWrapper.className = "ml-auto";

          // Create the indicator using the brand color
          indicatorWrapper.innerHTML = `
            <span class="relative ml-auto flex h-2 w-2" title="${modificationLabel}" aria-label="${modificationLabel}">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-light opacity-75 duration-1000"></span>
              <span class="relative inline-flex h-2 w-2 rounded-full bg-brand"></span>
            </span>
          `;

          // Append to link
          link.appendChild(indicatorWrapper);
        }
      }
    };

    // Initial add with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      addIndicators();
    }, 100);

    // Re-add on navigation or DOM changes (for client-side navigation)
    const observer = new MutationObserver(() => {
      addIndicators();
    });

    const sidebar =
      document.querySelector("[data-sidebar]") ||
      document.querySelector("aside") ||
      document.querySelector("nav");

    if (sidebar) {
      observer.observe(sidebar, {
        childList: true,
        subtree: true,
      });
    }

    // Cleanup
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [recentPagesMap]);

  return null;
}
