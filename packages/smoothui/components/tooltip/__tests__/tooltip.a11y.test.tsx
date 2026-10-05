import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Tooltip from "../index";

describe("Tooltip a11y", () => {
  it("has no accessibility violations when closed", async () => {
    const { container } = render(
      <Tooltip content="Helpful tip">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <Tooltip content="Helpful tip" open>
        <button type="button">Hover me</button>
      </Tooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
