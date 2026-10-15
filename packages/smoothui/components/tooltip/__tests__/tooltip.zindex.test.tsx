import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import {
  DialogHost,
  dialogLayer,
  installStackingCss,
  layerOf,
} from "../../dialog/__tests__/stacking";
import Tooltip from "../tooltip.radix";

let removeCss: (() => void) | undefined;
beforeEach(() => {
  removeCss = installStackingCss();
});
afterEach(() => removeCss?.());

describe("Tooltip (Radix) stacking", () => {
  it("renders at or above the Dialog layer when opened from inside one", () => {
    render(
      <DialogHost>
        <Tooltip content="Hint" open>
          <button type="button">Trigger</button>
        </Tooltip>
      </DialogHost>
    );
    const content = document.querySelector('[data-slot="tooltip-content"]');
    const wrapper = content?.parentElement;
    expect(wrapper?.hasAttribute("data-radix-popper-content-wrapper")).toBe(
      true
    );
    expect(layerOf(content)).toBeGreaterThanOrEqual(dialogLayer());
    expect(
      Number((wrapper as HTMLElement).style.zIndex)
    ).toBeGreaterThanOrEqual(dialogLayer());
  });
});
