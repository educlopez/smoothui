import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import PriceFlow from "../index";

describe("PriceFlow", () => {
  it("renders without throwing", () => {
    const { container } = render(<PriceFlow value={42} />);
    expect(container).toBeInTheDocument();
  });
});
