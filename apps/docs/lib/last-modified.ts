import manifest from "@docs/lib/generated/last-modified.json";

const times = manifest.times as Record<string, number>;

const normalize = (path: string): string => {
  const trimmed = path.replace(/^\/+/, "");
  return trimmed.endsWith(".mdx") ? trimmed : `${trimmed}.mdx`;
};

/**
 * Last-updated timestamp for a docs page, from the build-time git manifest.
 * Returns undefined when git was unavailable or the path is missing.
 */
export const getLastModified = (infoPath: string): number | undefined => {
  const stripped = infoPath.replace(/^docs\//, "");
  const candidates = [
    infoPath,
    normalize(infoPath),
    stripped,
    normalize(stripped),
  ];
  for (const key of candidates) {
    const value = times[key];
    if (value) {
      return value;
    }
  }
};
