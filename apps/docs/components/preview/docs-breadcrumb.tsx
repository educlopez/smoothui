"use client";

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
 * On split pages the sidebar starts collapsed and reveals itself as a floating
 * card when the pointer reaches the left edge. That reveal is internal state in
 * Fumadocs' `SidebarContent` — no prop, no context — driven by pointer events on
 * the sidebar element, so the button reproduces the gesture rather than inventing
 * a second navigation surface next to it. One catalogue, two ways in.
 */
export const DocsBreadcrumb = ({ section, title }: DocsBreadcrumbProps) => {
  const revealSidebar = () => {
    const sidebar = document.querySelector("#nd-sidebar");
    sidebar?.dispatchEvent(
      new PointerEvent("pointerover", {
        bubbles: true,
        clientX: 4,
        clientY: Math.round(window.innerHeight / 2),
        pointerType: "mouse",
      })
    );
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="not-prose flex items-center gap-1.5 text-sm"
    >
      {/* Icon and section name are one control: the crumb *is* the handle, so
          there is nothing to aim at separately. */}
      <button
        className="-ml-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        onClick={revealSidebar}
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

export default DocsBreadcrumb;
