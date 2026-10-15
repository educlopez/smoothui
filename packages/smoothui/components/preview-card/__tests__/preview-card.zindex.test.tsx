import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import {
  DialogHost,
  dialogLayer,
  installStackingCss,
  layerOf,
} from "../../dialog/__tests__/stacking";
import PreviewCardBase from "../preview-card.base";
import PreviewCardRadix from "../preview-card.radix";

let removeCss: (() => void) | undefined;
beforeEach(() => {
  removeCss = installStackingCss();
});
afterEach(() => removeCss?.());

describe("PreviewCard stacking", () => {
  it("Base: the positioner renders at or above the Dialog layer", () => {
    render(
      <DialogHost>
        <PreviewCardBase open trigger={<a href="/docs">Docs</a>}>
          <p>Preview</p>
        </PreviewCardBase>
      </DialogHost>
    );
    const positioner = document.querySelector(
      '[data-slot="preview-card-positioner"]'
    );
    expect(layerOf(positioner)).toBeGreaterThanOrEqual(dialogLayer());
  });

  it("Radix: the popup and its Radix wrapper render at or above the Dialog layer", () => {
    render(
      <DialogHost>
        <PreviewCardRadix open trigger={<a href="/docs">Docs</a>}>
          <p>Preview</p>
        </PreviewCardRadix>
      </DialogHost>
    );
    const content = document.querySelector('[data-slot="preview-card-popup"]');
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
