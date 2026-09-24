import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { posterClip } from "./capture-component-posters";
import { galleryComponentSlugs } from "./component-poster-slugs";

const ROOT = join(import.meta.dirname, "..");
const COVERS = join(ROOT, "apps/docs/components/gallery/covers/components");

const readPages = (): string[] => {
  const meta = JSON.parse(
    readFileSync(
      join(ROOT, "apps/docs/content/docs/components/meta.json"),
      "utf8"
    )
  ) as { pages: string[] };
  return meta.pages;
};

describe("component index posters", () => {
  it("lists every component and skips the guide", () => {
    const slugs = galleryComponentSlugs(readPages());
    expect(slugs.length).toBeGreaterThan(0);
    expect(slugs).not.toContain("index");
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has a poster file and a manifest entry for every component", () => {
    const slugs = galleryComponentSlugs(readPages());
    const manifest = readFileSync(
      join(ROOT, "apps/docs/components/gallery/component-shots.ts"),
      "utf8"
    );
    const imported = [
      ...manifest.matchAll(/from "\.\/covers\/components\/([^"]+)\.webp"/g),
    ].flatMap((match) => (match[1] ? [match[1]] : []));

    for (const slug of slugs) {
      expect(existsSync(join(COVERS, `${slug}.webp`)), slug).toBe(true);
    }

    const byName = (left: string, right: string) => left.localeCompare(right);
    expect(imported.toSorted(byName)).toEqual(slugs.toSorted(byName));
  });

  it("does not mount live demos on the index", () => {
    const card = readFileSync(
      join(ROOT, "apps/docs/components/gallery/component-card.tsx"),
      "utf8"
    );
    const gallery = readFileSync(
      join(ROOT, "apps/docs/components/gallery/component-gallery.tsx"),
      "utf8"
    );

    expect(card).not.toContain("GalleryPreview");
    expect(card).not.toContain("gallery-preview");
    expect(card).toContain("h-12");
    expect(card).toContain("POSTER_CHROME = 50");
    expect(gallery).not.toContain("GalleryPreview");
    expect(gallery).not.toContain("eager");
  });

  it("crops tall demos and keeps a floor for short ones", () => {
    expect(
      posterClip({
        bottom: 2000,
        top: 40,
        viewportHeight: 1400,
        viewportWidth: 560,
      })
    ).toEqual({ height: 640, width: 560, x: 0, y: 12 });

    expect(
      posterClip({
        bottom: 80,
        top: 40,
        viewportHeight: 1400,
        viewportWidth: 560,
      }).height
    ).toBeGreaterThanOrEqual(112);
  });
});
