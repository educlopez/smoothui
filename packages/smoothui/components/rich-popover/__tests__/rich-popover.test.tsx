import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import RichPopover from "../index";

describe("RichPopover", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <RichPopover title="Test" trigger={<button type="button">Open</button>} />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <RichPopover title="Test" trigger={<button type="button">Open</button>} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
