import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ContextMenu from "../index";

const items = [
  { key: "copy", label: "Copy" },
  { key: "paste", label: "Paste" },
];

describe("ContextMenu a11y", () => {
  it("has no accessibility violations in closed state", async () => {
    const { container } = render(
      <ContextMenu items={items}>
        <div>Right-click me</div>
      </ContextMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
