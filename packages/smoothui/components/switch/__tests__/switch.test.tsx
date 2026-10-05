import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Switch from "../index";

describe("Switch", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Switch aria-label="Airplane mode" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<Switch aria-label="Notifications" />);
    expect(container).toBeInTheDocument();
  });
});
