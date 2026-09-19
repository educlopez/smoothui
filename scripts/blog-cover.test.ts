import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  blogCover,
  blogCoverDirections,
  blogCoverImage,
} from "../apps/docs/lib/blog-cover";

const RETIRED_PINK = /#(?:ef5da8|fce5f1|f7d9e9|f5d7e7|f9dbeb)/i;

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
  it("keeps illustration highlights neutral without recoloring cover backgrounds", () => {
    const source = readFileSync(
      new URL(
        "../apps/docs/components/blog/blog-cover-illustration.tsx",
        import.meta.url
      ),
      "utf8"
    );
    expect(source).toContain("#4b5563");
    expect(source).toContain("#e5e7eb");
    expect(source).not.toMatch(RETIRED_PINK);
  });
  it("provides an editorial fallback for future posts", () => {
    expect(blogCover("/blog/future-post").kind).toBe("notes");
  });
});
