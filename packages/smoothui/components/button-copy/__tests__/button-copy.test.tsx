import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ButtonCopy from "../index";

describe("ButtonCopy", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<ButtonCopy />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<ButtonCopy />);
    expect(container).toBeInTheDocument();
  });
});
