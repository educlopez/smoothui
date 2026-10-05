import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Skeleton from "../index";

describe("Skeleton", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Skeleton aria-hidden className="h-4 w-32" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders data-slot skeleton", () => {
    const { container } = render(<Skeleton className="h-8 w-full" />);
    expect(container.querySelector("[data-slot='skeleton']")).not.toBeNull();
  });
});
