"use client";

import { useSidebar } from "fumadocs-ui/components/sidebar/base";
import { PanelLeft } from "lucide-react";

export type DocsBreadcrumbProps = {
  /** e.g. "Components". */
  section: string;
  /** e.g. "Siri Orb". */
  title: string;
};

/**
 * Breadcrumb that doubles as the sidebar handle.
 *
 * The sidebar is docked open on these pages, and this button toggles it through
 * Fumadocs' sidebar context, so it closes what it opened. When collapsed, the
 * sidebar still reveals as a floating card at the left edge of the viewport.
 */
export const DocsBreadcrumb = ({ section, title }: DocsBreadcrumbProps) => {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <nav
      aria-label="Breadcrumb"
      className="not-prose flex items-center gap-1.5 text-sm"
    >
      {/* Icon and section name are one control: the crumb *is* the handle, so
          there is nothing to aim at separately. */}
      <button
        className="-ml-1.5 flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-expanded={!collapsed}
        onClick={() => setCollapsed(!collapsed)}
        type="button"
      >
        <PanelLeft aria-hidden="true" size={15} />
        {section}
      </button>
      <span className="text-muted-foreground/50">/</span>
      <span className="text-foreground">{title}</span>
    </nav>
  );
};
