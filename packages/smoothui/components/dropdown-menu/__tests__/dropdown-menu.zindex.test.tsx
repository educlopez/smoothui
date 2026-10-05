import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import {
  DialogHost,
  dialogLayer,
  installStackingCss,
  layerOf,
} from "../../dialog/__tests__/stacking";
import DropdownMenu from "../dropdown-menu.radix";

let removeCss: (() => void) | undefined;
beforeEach(() => {
  removeCss = installStackingCss();
});
afterEach(() => removeCss?.());

describe("DropdownMenu (Radix) stacking", () => {
  it("renders at or above the Dialog layer when opened from inside one", () => {
    render(
      <DialogHost>
        <DropdownMenu items={[{ key: "edit", label: "Edit" }]} open>
          <button type="button">Menu</button>
        </DropdownMenu>
      </DialogHost>
    );
    const content = screen.getByRole("menu");
    const wrapper = content.parentElement;
    expect(wrapper?.hasAttribute("data-radix-popper-content-wrapper")).toBe(
      true
    );
    expect(layerOf(content)).toBeGreaterThanOrEqual(dialogLayer());
    expect(
      Number((wrapper as HTMLElement).style.zIndex)
    ).toBeGreaterThanOrEqual(dialogLayer());
  });
});
