import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedOTPInput from "../index";

describe("AnimatedOTPInput", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<AnimatedOTPInput />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<AnimatedOTPInput />);
    expect(container).toBeInTheDocument();
  });
});
