import { describe, expect, it, vi } from "vitest";
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

  it("keeps a consumer callback ref stable across re-renders", () => {
    const ref = vi.fn();
    const { container, rerender } = render(<Skeleton ref={ref} />);
    const node = container.querySelector("[data-slot='skeleton']");
    expect(ref).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenLastCalledWith(node);
    rerender(<Skeleton className="x" ref={ref} />);
    rerender(<Skeleton className="y" ref={ref} />);
    // A rebuilt ref callback would fire null then the node on every render.
    expect(ref).toHaveBeenCalledTimes(1);
  });
});
