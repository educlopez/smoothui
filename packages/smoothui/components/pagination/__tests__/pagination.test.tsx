import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Pagination from "../index";

describe("Pagination", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Pagination onPageChange={vi.fn()} page={1} totalPages={10} />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Pagination onPageChange={vi.fn()} page={1} totalPages={10} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
