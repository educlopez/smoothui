import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Popover from "../index";

describe("Popover", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Popover trigger={<button type="button">Open</button>}>
        <p>Popover content</p>
      </Popover>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <Popover trigger={<button type="button">Open</button>}>
        <p>Popover content</p>
      </Popover>
    );
    expect(container).toBeInTheDocument();
  });
});
