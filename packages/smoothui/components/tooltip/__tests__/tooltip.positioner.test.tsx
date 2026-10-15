import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Tooltip from "../tooltip.base";

describe("Tooltip (Base) stacking", () => {
  it("puts z-50 on the positioner and keeps the popup free of it", () => {
    render(
      <Tooltip content="Hint" open>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    const positioner = document.querySelector(
      '[data-slot="tooltip-positioner"]'
    );
    const popup = document.querySelector('[data-slot="tooltip-content"]');
    expect(positioner).not.toBeNull();
    expect(popup).not.toBeNull();
    expect(positioner?.classList.contains("z-50")).toBe(true);
    expect(popup?.classList.contains("z-50")).toBe(false);
  });
});
