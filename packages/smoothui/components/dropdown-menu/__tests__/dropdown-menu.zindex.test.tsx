import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import DropdownMenu from "../dropdown-menu.radix";

describe("DropdownMenu (Radix) stacking", () => {
  it("keeps z-50 on the content element that Radix copies to its wrapper", () => {
    render(
      <DropdownMenu items={[{ key: "edit", label: "Edit" }]} open>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    const content = screen.getByRole("menu");
    expect(content.classList.contains("z-50")).toBe(true);
    expect(
      content.parentElement?.hasAttribute("data-radix-popper-content-wrapper")
    ).toBe(true);
  });
});
