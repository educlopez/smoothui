import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Tooltip from "../tooltip.radix";

describe("Tooltip (Radix) stacking", () => {
  it("keeps z-50 on the content element that Radix copies to its wrapper", () => {
    render(
      <Tooltip content="Hint" open>
        <button type="button">Trigger</button>
      </Tooltip>
    );
    const content = document.querySelector('[data-slot="tooltip-content"]');
    expect(content).not.toBeNull();
    expect(content?.classList.contains("z-50")).toBe(true);
    expect(
      content?.parentElement?.hasAttribute("data-radix-popper-content-wrapper")
    ).toBe(true);
  });
});
