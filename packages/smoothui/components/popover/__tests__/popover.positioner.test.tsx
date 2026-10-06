import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Popover from "../popover.base";

describe("Popover (Base) stacking", () => {
  it("puts z-50 on the positioner and keeps the popup free of it", () => {
    render(
      <Popover open trigger={<button type="button">Open</button>}>
        <p>Content</p>
      </Popover>
    );
    const positioner = document.querySelector(
      '[data-slot="popover-positioner"]'
    );
    const popup = document.querySelector('[data-slot="popover-content"]');
    expect(positioner).not.toBeNull();
    expect(popup).not.toBeNull();
    expect(positioner?.classList.contains("z-50")).toBe(true);
    expect(popup?.classList.contains("z-50")).toBe(false);
  });
});
