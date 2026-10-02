import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Popover from "../index";

describe("Popover a11y", () => {
  it("has no accessibility violations when closed", async () => {
    const { container } = render(
      <Popover trigger={<button type="button">Open popover</button>}>
        <p>Details about this action.</p>
      </Popover>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <Popover open trigger={<button type="button">Open popover</button>}>
        <p>Details about this action.</p>
      </Popover>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
