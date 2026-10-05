import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Tooltip from "../index";

describe("Tooltip", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Tooltip content="Helpful tip">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <Tooltip content="Helpful tip">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    expect(container).toBeInTheDocument();
  });
});
