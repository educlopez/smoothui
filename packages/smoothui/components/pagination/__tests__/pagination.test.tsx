import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import Pagination from "../index";

describe("Pagination", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Pagination page={1} totalPages={10} onPageChange={vi.fn()} />
    );
    expect(container).toBeInTheDocument();
  });
});
