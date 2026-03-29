import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Checkbox from "../index";

describe("Checkbox", () => {
  it("renders without throwing", () => {
    const { container } = render(<Checkbox />);
    expect(container).toBeInTheDocument();
  });
});
