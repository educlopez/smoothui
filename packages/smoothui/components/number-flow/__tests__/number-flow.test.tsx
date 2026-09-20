import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { fireEvent, render } from "../../../test-utils/render";
import NumberFlow from "../index";

describe("NumberFlow", () => {
  it("renders without throwing", () => {
    const { container } = render(<NumberFlow />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<NumberFlow />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("does not collapse rapid controlled increments to the same value", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <NumberFlow onChange={onChange} value={128} />
    );
    const increase = getByRole("button", { name: "Increase number" });
    fireEvent.click(increase);
    fireEvent.click(increase);
    expect(onChange.mock.calls.map((call) => call[0])).toEqual([129, 130]);
  });
});
