import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Book from "../index";

describe("Book", () => {
  it("renders without throwing", () => {
    const { container } = render(<Book title="Test Book" />);
    expect(container).toBeInTheDocument();
  });
});
