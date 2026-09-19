import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ContextMenu from "../index";

describe("ContextMenu", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <ContextMenu items={[{ key: "item1", label: "Item 1" }]}>
        <div>Right-click me</div>
      </ContextMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <ContextMenu items={[{ key: "item1", label: "Item 1" }]}>
        <div>Right-click me</div>
      </ContextMenu>
    );
    expect(container).toBeInTheDocument();
  });
});
