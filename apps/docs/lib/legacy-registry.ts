/**
 * Single source of truth for v4 package and docs URL renames.
 *
 * Registry aliases, `/docs/components/*` 308s, and `/doc/basic/{old}`
 * shortcuts all read from this module so they cannot drift.
 */

export type PermanentRedirect = {
  destination: string;
  permanent: true;
  source: string;
};

/** Owned primitives that used to live under /docs/components. */
export const PRIMITIVES_MOVED = [
  "accordion",
  "checkbox",
  "code-block",
  "combobox",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "radio-group",
  "select",
  "smooth-button",
] as const;

/** Pattern components that kept a docs page under a new slug. */
export const COMPONENT_RENAMES = [
  ["animated-input", "float-input"],
  ["animated-number-input", "digit-roll"],
  ["animated-o-t-p-input", "otp-slots"],
  ["animated-otp-input", "otp-slots"],
  ["animated-toggle", "morph-toggle"],
  ["country-dialog", "country-picker"],
  ["notification-badge", "count-badge"],
  ["skeleton-loader", "content-skeleton"],
] as const;

/** Deleted near-duplicates that now install as the owned primitive. */
export const DELETED_TO_PRIMITIVES = [
  ["animated-progress-bar", "progress"],
  ["animated-tabs", "tabs"],
  ["animated-tooltip", "tooltip"],
  ["basic-accordion", "accordion"],
  ["basic-dropdown", "dropdown-menu"],
  ["basic-modal", "dialog"],
  ["basic-toast", "toast"],
  ["searchable-dropdown", "combobox"],
] as const;

const registryAliasEntries = [
  ...COMPONENT_RENAMES,
  ...DELETED_TO_PRIMITIVES,
].filter(([from, to]) => from !== to);

/** Old registry JSON name → current registry JSON name. */
export const REGISTRY_ALIASES: Readonly<Record<string, string>> =
  Object.fromEntries(registryAliasEntries);

export const LEGACY_REGISTRY_NAMES = Object.keys(REGISTRY_ALIASES);

export const resolveRegistryName = (name: string): string =>
  REGISTRY_ALIASES[name] ?? name;

const redirect = (source: string, destination: string): PermanentRedirect => ({
  destination,
  permanent: true,
  source,
});

/** `/docs/components/{old}` → the page that replaced it. */
export const docsComponentRedirects = (): PermanentRedirect[] => [
  ...PRIMITIVES_MOVED.map((slug) =>
    redirect(`/docs/components/${slug}`, `/docs/primitives/${slug}`)
  ),
  redirect("/docs/guides/primitives", "/docs/primitives"),
  redirect("/docs/components/matrix-card", "/docs/components"),
  redirect("/docs/components/ai-input", "/docs/components/morph-surface"),
  ...COMPONENT_RENAMES.map(([from, to]) =>
    redirect(`/docs/components/${from}`, `/docs/components/${to}`)
  ),
  ...DELETED_TO_PRIMITIVES.map(([from, to]) =>
    redirect(`/docs/components/${from}`, `/docs/primitives/${to}`)
  ),
];

/**
 * Direct `/doc/basic/{old}` → final destination, so the wildcard
 * `/doc/basic/:component` cannot bounce through `/docs/components/{old}`.
 * Must be registered before that wildcard.
 */
export const docBasicDirectRedirects = (): PermanentRedirect[] =>
  docsComponentRedirects()
    .filter((entry) => entry.source.startsWith("/docs/components/"))
    .map((entry) =>
      redirect(
        entry.source.replace("/docs/components/", "/doc/basic/"),
        entry.destination
      )
    );

const PARAM_SEGMENT = /^:[A-Za-z0-9_]+$/;

const matchesSource = (source: string, pathname: string): boolean => {
  const sourceParts = source.split("/");
  const pathParts = pathname.split("/");
  if (sourceParts.length !== pathParts.length) {
    return false;
  }
  return sourceParts.every((part, index) => {
    const value = pathParts[index];
    return part === value || (PARAM_SEGMENT.test(part) && Boolean(value));
  });
};

const applyDestination = (
  source: string,
  destination: string,
  pathname: string
) => {
  const sourceParts = source.split("/");
  const pathParts = pathname.split("/");
  const params = new Map<string, string>();
  for (const [index, part] of sourceParts.entries()) {
    if (PARAM_SEGMENT.test(part)) {
      const value = pathParts[index];
      if (value) {
        params.set(part.slice(1), value);
      }
    }
  }
  let resolved = destination;
  for (const [key, value] of params) {
    resolved = resolved.replace(`:${key}`, value);
    resolved = resolved.replace(`:${key}*`, value);
  }
  return resolved.replace(/\/:\w+\*?/g, "");
};

/**
 * Follow permanent redirects until a URL that is not itself a source.
 * Used to assert there are no double hops.
 */
export const resolveRedirectChain = (
  pathname: string,
  redirects: readonly PermanentRedirect[],
  maxHops = 5
): { hops: number; url: string } => {
  let current = pathname;
  let hops = 0;
  const seen = new Set<string>();

  while (hops < maxHops) {
    if (seen.has(current)) {
      return { hops, url: current };
    }
    seen.add(current);
    const match = redirects.find((entry) =>
      matchesSource(entry.source, current)
    );
    if (!match) {
      return { hops, url: current };
    }
    current = applyDestination(match.source, match.destination, current);
    hops += 1;
  }

  return { hops, url: current };
};
