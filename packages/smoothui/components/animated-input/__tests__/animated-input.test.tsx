import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedInput from "../index";

describe("AnimatedInput", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<AnimatedInput label="Email" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<AnimatedInput label="Email" />);
    expect(container).toBeInTheDocument();
  });
});
