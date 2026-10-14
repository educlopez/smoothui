import componentsMeta from "@docs/content/docs/components/meta.json";
import primitivesMeta from "@docs/content/docs/primitives/meta.json";
import { resolveRegistryName } from "@docs/lib/legacy-registry";

const isDocSlug = (entry: string): boolean =>
  entry !== "index" && !entry.startsWith("---");

const PRIMITIVE_SLUGS = new Set(primitivesMeta.pages.filter(isDocSlug));
const COMPONENT_SLUGS = new Set(componentsMeta.pages.filter(isDocSlug));

/**
 * Docs URL for a registry / showcase slug, or `null` when there is no page
 * (shared internals such as `ai-core`).
 */
export const docsHrefForSlug = (slug: string): string | null => {
  const canonical = resolveRegistryName(slug);
  if (PRIMITIVE_SLUGS.has(canonical)) {
    return `/docs/primitives/${canonical}`;
  }
  if (COMPONENT_SLUGS.has(canonical)) {
    return `/docs/components/${canonical}`;
  }
  return null;
};
