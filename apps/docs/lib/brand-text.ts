import type { BrandKey } from "./brand-icons";

/**
 * Prose mentions of the projects SmoothUI builds on get their mark in front of
 * the name. Matching is case-sensitive on the written form of the name, so
 * package names (`@radix-ui/react-tabs`, `radix-ui`) and lowercase identifiers
 * are left alone, and it only ever runs on plain text, never on code.
 */
// Only the projects SmoothUI is built on. Written forms, longest first within a
// project; `source` is a regular expression fragment, matched case-sensitively.
const BRAND_NAMES: ReadonlyArray<{ key: BrandKey; source: string }> = [
  { key: "base-ui", source: "Base UI" },
  { key: "radix", source: "Radix UI" },
  { key: "radix", source: "Radix" },
  { key: "nextjs", source: "Next\\.js" },
  { key: "nextjs", source: "NextJS" },
  { key: "shadcn", source: "shadcn/ui" },
  { key: "shadcn", source: "shadcn" },
  { key: "shadcn", source: "Shadcn" },
];

// Not preceded by a word character or a path/package separator, and not
// followed by one, so `@shadcn/ui`, `npm-run-all` and `React-DOM` stay text.
// One capture group per written form tells us which project matched.
const BRAND_PATTERN = new RegExp(
  `(?<![\\w@/.-])(?:${BRAND_NAMES.map(({ source }) => `(${source})`).join("|")})(?![\\w-])`,
  "g"
);

export type BrandTextPart = string | { brand: BrandKey; name: string };

export const splitBrandText = (text: string): BrandTextPart[] => {
  const parts: BrandTextPart[] = [];
  let last = 0;
  for (const match of text.matchAll(BRAND_PATTERN)) {
    const groupIndex = match.findIndex(
      (group, index) => index > 0 && group !== undefined
    );
    const [name] = match;
    const brand = BRAND_NAMES[groupIndex - 1]?.key;
    if (!brand) {
      continue;
    }
    const start = match.index ?? 0;
    if (start > last) {
      parts.push(text.slice(last, start));
    }
    parts.push({ brand, name });
    last = start + name.length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts;
};
