import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Skeleton from "../index";

const TRANSLATE_UTILITY = /(?:^|\s)-?translate-(?:x|y)?-?[\w[\]/.-]*/;

describe("Skeleton shimmer transform", () => {
  it("drives the shimmer with one transform, not a translate class plus an animated x", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const shimmer = container.querySelector(
      '[data-slot="skeleton-shimmer"]'
    ) as HTMLElement;
    // Reference first: the shimmer element exists and is animated.
    expect(shimmer).not.toBeNull();
    expect(shimmer.style.transform).toContain("translateX");
    // Tailwind v4 translate utilities write the `translate` property, which
    // stacks on top of the animated `transform`, so the sweep never ends.
    expect(shimmer.className).not.toMatch(TRANSLATE_UTILITY);
    expect(shimmer.style.translate).toBe("");
  });

  it("hints the compositor while it loops", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);
    const shimmer = container.querySelector('[data-slot="skeleton-shimmer"]');
    expect(shimmer?.classList.contains("will-change-transform")).toBe(true);
  });
});
