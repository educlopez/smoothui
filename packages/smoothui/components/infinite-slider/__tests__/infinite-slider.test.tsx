import { animate } from "motion/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import InfiniteSlider from "../index";

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>();
  return { ...actual, animate: vi.fn(() => ({ stop: vi.fn() })) };
});

describe("InfiniteSlider", () => {
  it("defaults to running and pauses without scheduling infinite durations", () => {
    vi.mocked(animate).mockClear();
    const { rerender } = render(
      <InfiniteSlider paused>
        <span>One</span>
      </InfiniteSlider>
    );
    expect(animate).not.toHaveBeenCalled();
    rerender(
      <InfiniteSlider>
        <span>One</span>
      </InfiniteSlider>
    );
    expect(animate).toHaveBeenCalled();
    vi.mocked(animate).mockClear();
    rerender(
      <InfiniteSlider speed={0} paused>
        <span>One</span>
      </InfiniteSlider>
    );
    expect(animate).not.toHaveBeenCalled();
  });
  it("does not schedule animation when initial speed is zero", () => {
    vi.mocked(animate).mockClear();
    render(
      <InfiniteSlider speed={0} speedOnHover={0}>
        <span>One</span>
      </InfiniteSlider>
    );
    expect(animate).not.toHaveBeenCalled();
  });
  it("renders without throwing", () => {
    const { container } = render(
      <InfiniteSlider>
        <span>One</span>
        <span>Two</span>
      </InfiniteSlider>
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <InfiniteSlider>
        <span>One</span>
        <span>Two</span>
      </InfiniteSlider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
