import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  blogCover,
  blogCoverDirections,
  blogCoverImage,
} from "../apps/docs/lib/blog-cover";

describe("editorial blog covers", () => {
  it("gives all fifteen posts distinct semantic illustrations", () => {
    const directions = Object.values(blogCoverDirections);
    expect(directions).toHaveLength(15);
    expect(new Set(directions.map((direction) => direction.kind)).size).toBe(
      15
    );
    for (const slug of Object.keys(blogCoverDirections)) {
      expect(blogCover(`/blog/${slug}`)).toEqual(blogCoverDirections[slug]);
      expect(blogCoverImage(`/blog/${slug}`)).toContain(
        "?tr=f-png,w-1200,h-630"
      );
    }
  });

  it("uses oat fragment drawings without cover titles or retired pink fills", () => {
    const artwork = readFileSync(
      new URL(
        "../apps/docs/components/blog/blog-cover-artwork.tsx",
        import.meta.url
      ),
      "utf8"
    );
    const illustration = readFileSync(
      new URL(
        "../apps/docs/components/blog/blog-cover-illustration.tsx",
        import.meta.url
      ),
      "utf8"
    );
    expect(artwork).not.toContain("SmoothUI Journal");
    expect(artwork).not.toContain("direction.label");
    expect(artwork).not.toContain("direction.detail");
    expect(illustration).toContain("CANDY");
    expect(illustration).toContain("icon-ui-craft.png");
    expect(illustration).not.toMatch(
      /#(?:ef5da8|fce5f1|f7d9e9|f5d7e7|f9dbeb)/i
    );
  });

  it("provides an editorial fallback for future posts", () => {
    expect(blogCover("/blog/future-post").kind).toBe("notes");
  });
});
