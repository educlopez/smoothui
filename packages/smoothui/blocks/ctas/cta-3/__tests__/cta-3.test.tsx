import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../../test-utils/render";
import Block from "../index";

describe("Cta3", () => {
  it("renders without throwing", () => {
    const { container } = render(<Block />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Block />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
