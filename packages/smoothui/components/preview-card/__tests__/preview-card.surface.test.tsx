import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import PreviewCardBase from "../preview-card.base";
import PreviewCardRadix from "../preview-card.radix";

const twins = [
  ["Base", PreviewCardBase],
  ["Radix", PreviewCardRadix],
] as const;

describe.each(twins)("PreviewCard (%s) surface", (_name, PreviewCard) => {
  const open = () =>
    render(
      <PreviewCard open trigger={<a href="/docs">Docs</a>}>
        <p>Preview</p>
      </PreviewCard>
    );
  const surfaceOf = () =>
    document.querySelector('[data-slot="preview-card-popup"]') as HTMLElement;

  it("animates the bordered surface itself", () => {
    reduced.value = false;
    open();
    const surface = surfaceOf();
    expect(surface).not.toBeNull();
    expect(surface.classList.contains("border")).toBe(true);
    expect(surface.style.opacity).not.toBe("");
    expect(Number(surface.style.opacity)).toBeLessThan(1);
  });

  it("is opaque on first render with reduced motion", () => {
    reduced.value = true;
    open();
    expect(surfaceOf().style.opacity).toBe("1");
  });
});
