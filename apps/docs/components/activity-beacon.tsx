"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Forwards every route change to our own /api/activity-beacon endpoint,
 * which signs and relays it server-side to the portfolio's activity feed.
 * Fire-and-forget: never blocks rendering and never surfaces errors.
 */
export function ActivityBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/activity-beacon", {
      body: JSON.stringify({ path: pathname, title: document.title }),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      method: "POST",
    }).catch(() => {
      // Best-effort telemetry: never let a failed beacon affect the page.
    });
  }, [pathname]);

  return null;
}
