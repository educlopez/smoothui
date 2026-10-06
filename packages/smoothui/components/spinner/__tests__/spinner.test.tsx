import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Spinner from "../index";

describe("Spinner", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("exposes a status role with accessible name", () => {
    render(<Spinner aria-label="Saving" />);
    expect(screen.getByRole("status", { name: "Saving" })).toHaveAttribute(
      "data-slot",
      "spinner"
    );
  });

  it("keeps a consumer callback ref stable across re-renders", () => {
    const ref = vi.fn();
    const { container, rerender } = render(<Spinner ref={ref} />);
    const node = container.querySelector("[data-slot='spinner']");
    expect(ref).toHaveBeenCalledTimes(1);
    expect(ref).toHaveBeenLastCalledWith(node);
    rerender(<Spinner className="x" ref={ref} />);
    rerender(<Spinner className="y" ref={ref} />);
    // A rebuilt ref callback would fire null then the node on every render.
    expect(ref).toHaveBeenCalledTimes(1);
  });
});
