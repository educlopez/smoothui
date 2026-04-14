import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ContextMenu from "../index";

describe("ContextMenu", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ContextMenu items={[{ key: "item1", label: "Item 1" }]}>
        <div>Right-click me</div>
      </ContextMenu>
    );
    expect(container).toBeInTheDocument();
  });
});
