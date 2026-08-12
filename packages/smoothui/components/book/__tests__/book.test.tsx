import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Book from "../index";

describe("Book", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Book title="Test Book" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<Book title="Test Book" />);
    expect(container).toBeInTheDocument();
  });
});
