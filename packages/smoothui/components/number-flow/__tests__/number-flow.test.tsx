import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import NumberFlow from "../index";

describe("NumberFlow", () => {
  it("renders without throwing", () => {
    const { container } = render(<NumberFlow />);
    expect(container).toBeInTheDocument();
  });
});
