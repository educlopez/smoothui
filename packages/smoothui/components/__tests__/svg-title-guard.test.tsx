import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const COMPONENTS_DIR = path.resolve(import.meta.dirname, "..");
const TITLE_TAG = /<title[\s>]/;

/**
 * Files allowed to keep an SVG `<title>`: each one names a meaningful image
 * (logo, card network, illustration or labelled icon), not a decorative glyph
 * inside a control whose own name already says what it is.
 */
const ALLOWED_TITLE_FILES: Record<string, string> = {
  "ai-orb-face/index.tsx":
    "the SVG is a standalone character illustration named by its aria-label",
  "app-download-stack/index.tsx":
    "checkmark inside a showcase illustration, not an interactive control",
  "clip-corners-button/index.tsx":
    "corner triangles are named shapes of a decorative button frame",
  "emboss-surface/index.tsx":
    "title of an SVG filter definition, not rendered content",
  "folder-reveal/index.tsx": "folder illustration named for assistive tech",
  "glass-card/index.tsx":
    "title of an SVG filter definition, not rendered content",
  "job-listing-component/index.tsx":
    "brand logos (Resend, Turso, Supabase) that name the company",
  "morph-icon/index.tsx":
    "the icon renders a title only when the consumer passes a label",
  "social-selector/index.tsx":
    "network logos (X, Threads, Bluesky) that name the network",
  "wallet-card/index.tsx":
    "card chip, contactless and network marks of a card illustration",
};

/** Controls whose SVGs are decorative: they must never hold a title again. */
const TITLE_FREE_CONTROLS = [
  "checkbox",
  "checkbox-group",
  "number-field",
  "navigation-menu",
];

const listSourceFiles = (dir: string): string[] => {
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "__tests__" || entry.name === "node_modules") {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...listSourceFiles(full));
    } else if (entry.name.endsWith(".tsx")) {
      found.push(full);
    }
  }
  return found;
};

const filesWithTitle = (): string[] =>
  listSourceFiles(COMPONENTS_DIR)
    .filter((file) => TITLE_TAG.test(readFileSync(file, "utf8")))
    .map((file) =>
      path.relative(COMPONENTS_DIR, file).split(path.sep).join("/")
    )
    .sort((a, b) => a.localeCompare(b));

describe("SVG title guard", () => {
  it("scans real source files", () => {
    expect(listSourceFiles(COMPONENTS_DIR).length).toBeGreaterThan(100);
  });

  it("only allowlisted files hold an SVG <title>", () => {
    const unexpected = filesWithTitle().filter(
      (file) => !(file in ALLOWED_TITLE_FILES)
    );
    expect(unexpected).toEqual([]);
  });

  it("keeps the allowlist honest: no stale entries", () => {
    const withTitle = new Set(filesWithTitle());
    const stale = Object.keys(ALLOWED_TITLE_FILES).filter(
      (file) => !withTitle.has(file)
    );
    expect(stale).toEqual([]);
  });

  it.each(TITLE_FREE_CONTROLS)("%s has no SVG <title> in any twin", (slug) => {
    const offenders = filesWithTitle().filter((file) =>
      file.startsWith(`${slug}/`)
    );
    expect(offenders).toEqual([]);
  });
});
