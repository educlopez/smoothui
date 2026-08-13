import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import DropdownMenu from "../index";

describe("DropdownMenu", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <DropdownMenu items={[{ key: "item1", label: "Item 1" }]}>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <DropdownMenu items={[{ key: "item1", label: "Item 1" }]}>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    expect(container).toBeInTheDocument();
  });
});
