import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import DynamicIsland from "../index";

describe("DynamicIsland", () => {
  it("renders without throwing", () => {
    const { container } = render(<DynamicIsland />);
    expect(container).toBeInTheDocument();
  });
});
