import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import TooltipBase from "../tooltip.base";
import TooltipRadix from "../tooltip.radix";

const surfaceOf = () =>
  document.querySelector('[data-slot="tooltip-content"]') as HTMLElement;

describe("Tooltip (Base) surface", () => {
  it("animates the popup itself through starting and ending styles", () => {
    render(
      <TooltipBase content="Hint" open>
        <button type="button">Trigger</button>
      </TooltipBase>
    );
    const surface = surfaceOf();
    expect(surface).not.toBeNull();
    expect(surface.classList.contains("bg-foreground")).toBe(true);
    expect(surface.classList.contains("data-[starting-style]:opacity-0")).toBe(
      true
    );
    expect(surface.classList.contains("data-[ending-style]:opacity-0")).toBe(
      true
    );
  });
});

describe("Tooltip (Radix) surface", () => {
  it("animates the filled surface itself", () => {
    reduced.value = false;
    render(
      <TooltipRadix content="Hint" open>
        <button type="button">Trigger</button>
      </TooltipRadix>
    );
    const surface = surfaceOf();
    expect(surface).not.toBeNull();
    expect(surface.classList.contains("bg-foreground")).toBe(true);
    expect(surface.style.opacity).not.toBe("");
    expect(Number(surface.style.opacity)).toBeLessThan(1);
  });

  it("is opaque on first render with reduced motion", () => {
    reduced.value = true;
    render(
      <TooltipRadix content="Hint" open>
        <button type="button">Trigger</button>
      </TooltipRadix>
    );
    expect(surfaceOf().style.opacity).toBe("1");
  });
});
