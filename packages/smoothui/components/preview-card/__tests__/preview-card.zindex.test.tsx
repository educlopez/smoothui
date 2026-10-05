import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import PreviewCardBase from "../preview-card.base";
import PreviewCardRadix from "../preview-card.radix";

describe("PreviewCard stacking", () => {
  it("Base: z-50 is on the positioner, not the popup", () => {
    render(
      <PreviewCardBase open trigger={<a href="/docs">Docs</a>}>
        <p>Preview</p>
      </PreviewCardBase>
    );
    const positioner = document.querySelector(
      '[data-slot="preview-card-positioner"]'
    );
    const popup = document.querySelector('[data-slot="preview-card-popup"]');
    expect(positioner?.classList.contains("z-50")).toBe(true);
    expect(popup?.classList.contains("z-50")).toBe(false);
  });

  it("Radix: z-50 is on the content element that Radix copies to its wrapper", () => {
    render(
      <PreviewCardRadix open trigger={<a href="/docs">Docs</a>}>
        <p>Preview</p>
      </PreviewCardRadix>
    );
    const content = document.querySelector('[data-slot="preview-card-popup"]');
    expect(content?.classList.contains("z-50")).toBe(true);
    expect(
      content?.parentElement?.hasAttribute("data-radix-popper-content-wrapper")
    ).toBe(true);
  });
});
