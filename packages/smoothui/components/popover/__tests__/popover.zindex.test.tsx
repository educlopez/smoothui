import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Popover from "../popover.radix";

describe("Popover (Radix) stacking", () => {
  it("keeps z-50 on the content element that Radix copies to its wrapper", () => {
    render(
      <Popover open trigger={<button type="button">Open</button>}>
        <p>Content</p>
      </Popover>
    );
    const content = document.querySelector('[data-slot="popover-content"]');
    expect(content).not.toBeNull();
    expect(content?.classList.contains("z-50")).toBe(true);
    expect(
      content?.parentElement?.hasAttribute("data-radix-popper-content-wrapper")
    ).toBe(true);
  });
});
