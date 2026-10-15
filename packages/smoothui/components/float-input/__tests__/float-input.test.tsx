import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import FloatInput from "../index";

describe("FloatInput", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<FloatInput label="Email" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<FloatInput label="Email" />);
    expect(container).toBeInTheDocument();
  });
});
