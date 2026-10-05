import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Empty from "../index";

describe("Empty", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Empty
        action={<button type="button">Add item</button>}
        description="Create your first item to get started."
        title="No items yet"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders title and description", () => {
    render(<Empty description="Try another filter." title="No results" />);
    expect(screen.getByText("No results")).toBeInTheDocument();
    expect(screen.getByText("Try another filter.")).toBeInTheDocument();
  });
});
