import { describe, expect, it } from "vitest";
import { docsHrefForSlug } from "../docs-href";

describe("docsHrefForSlug", () => {
  it("points primitive slugs at /docs/primitives", () => {
    expect(docsHrefForSlug("tabs")).toBe("/docs/primitives/tabs");
    expect(docsHrefForSlug("checkbox")).toBe("/docs/primitives/checkbox");
    expect(docsHrefForSlug("animated-tabs")).toBe("/docs/primitives/tabs");
  });

  it("points pattern slugs at /docs/components", () => {
    expect(docsHrefForSlug("magnetic-button")).toBe(
      "/docs/components/magnetic-button"
    );
  });

  it("returns null for shared internals with no docs page", () => {
    expect(docsHrefForSlug("ai-core")).toBeNull();
  });
});
