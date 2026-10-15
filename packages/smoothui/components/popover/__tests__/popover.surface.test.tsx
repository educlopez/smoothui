import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import PopoverBase from "../popover.base";
import PopoverRadix from "../popover.radix";

const twins = [
  ["Base", PopoverBase],
  ["Radix", PopoverRadix],
] as const;

describe.each(twins)("Popover (%s) surface", (_name, Popover) => {
  const open = () =>
    render(
      <Popover open trigger={<button type="button">Open</button>}>
        <p>Content</p>
      </Popover>
    );

  it("animates the bordered surface itself", () => {
    reduced.value = false;
    open();
    const surface = document.querySelector('[data-slot="popover-content"]');
    expect(surface).not.toBeNull();
    expect(surface?.classList.contains("border")).toBe(true);
    expect(surface?.classList.contains("bg-popover")).toBe(true);
    expect((surface as HTMLElement).style.opacity).not.toBe("");
    expect(Number((surface as HTMLElement).style.opacity)).toBeLessThan(1);
  });

  it("is opaque on first render with reduced motion", () => {
    reduced.value = true;
    open();
    const surface = document.querySelector(
      '[data-slot="popover-content"]'
    ) as HTMLElement;
    expect(surface.style.opacity).toBe("1");
  });
});
