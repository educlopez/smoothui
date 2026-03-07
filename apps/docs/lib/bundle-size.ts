import bundleSizeManifest from "@docs/lib/generated/bundle-sizes.json";

type BundleSizeEntry = {
  minified: number;
  gzipped: number;
};

type BundleSizeManifest = {
  generatedAt?: string;
  components?: Record<string, BundleSizeEntry>;
};

const manifest = bundleSizeManifest as BundleSizeManifest;

/**
 * Get the bundle size for a specific component by its slug (kebab-case name).
 * Returns null if the component is not found in the manifest.
 */
export const getBundleSize = (slug: string): BundleSizeEntry | null => {
  return manifest.components?.[slug] ?? null;
};

/**
 * Format a byte count into a human-readable string.
 * Returns format like "~0.4 kB" or "~12.5 kB".
 */
export const formatSize = (bytes: number): string => {
  const kb = bytes / 1024;
  return `~${kb.toFixed(1)} kB`;
};
