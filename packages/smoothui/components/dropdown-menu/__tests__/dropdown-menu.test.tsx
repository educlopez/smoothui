import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import DropdownMenu from "../index";

describe("DropdownMenu", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <DropdownMenu items={[{ key: "item1", label: "Item 1" }]}>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    expect(container).toBeInTheDocument();
  });
});
