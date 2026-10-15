import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import DropdownMenu from "../dropdown-menu.base";

const items = [
  { key: "edit", label: "Edit" },
  {
    children: [{ key: "sub-a", label: "Sub A" }],
    key: "more",
    label: "More",
  },
];

describe("DropdownMenu (Base) stacking", () => {
  it("puts z-50 on the root and submenu positioners, not on the popups", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu items={items} open>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    const root = document.querySelector(
      '[data-slot="dropdown-menu-positioner"]'
    );
    expect(root).not.toBeNull();
    expect(root?.classList.contains("z-50")).toBe(true);
    expect(screen.getByRole("menu").classList.contains("z-50")).toBe(false);

    await user.click(screen.getByRole("menuitem", { name: /more/i }));
    const sub = await screen.findByText("Sub A");
    expect(sub).toBeInTheDocument();
    const subPositioner = document.querySelector(
      '[data-slot="dropdown-menu-sub-positioner"]'
    );
    expect(subPositioner).not.toBeNull();
    expect(subPositioner?.classList.contains("z-50")).toBe(true);
    expect(
      screen.getAllByRole("menu").some((m) => m.classList.contains("z-50"))
    ).toBe(false);
  });
});
