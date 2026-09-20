"use client";

import { createContext, useContext } from "react";

/**
 * The channel the prose uses to drive the demo beside it.
 *
 * A component page says the same things twice — the writing explains
 * variants, then sizes, then icons, and the panel can show exactly that.
 *
 * A context rather than a prop because the two ends are in different
 * subtrees: the panel owns which demo is showing, and the prose is passed
 * into the layout as opaque content.
 *
 * Optional at both ends. Prose outside a showcase calls a function that does
 * nothing, and a showcase whose sections match no demo simply never hears
 * from it.
 */
export interface DemoSync {
  /** Called with a section's heading. Matched against the demo labels. */
  showSection: (heading: string) => void;
}

const DemoSyncContext = createContext<DemoSync>({
  showSection: () => undefined,
});

export const DemoSyncProvider = DemoSyncContext.Provider;

export const useDemoSync = (): DemoSync => useContext(DemoSyncContext);

/** Case and spacing are the only differences worth forgiving. */
export const sameHeading = (a: string, b: string): boolean => {
  const normalise = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, " ");
  return normalise(a) === normalise(b);
};

/**
 * Prose sections that should dim with the marker but never drive the demo.
 * Installation, props tables and a11y notes stay in the column; the panel
 * keeps whatever scene the last matching heading set.
 */
const META_HEADINGS = new Set([
  "installation",
  "props",
  "accessibility",
  "keyboard interactions",
  "aria attributes",
  "screen reader",
  "reduced motion",
  "guidelines",
  "dependencies",
  "references",
  "changelog",
]);

export const isDemoHeading = (heading: string): boolean => {
  const key = heading.trim().toLowerCase().replace(/\s+/g, " ");
  return key.length > 0 && !META_HEADINGS.has(key);
};
