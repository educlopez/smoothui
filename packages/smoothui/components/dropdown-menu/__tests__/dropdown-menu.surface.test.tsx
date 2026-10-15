import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import DropdownMenuBase from "../dropdown-menu.base";
import DropdownMenuRadix from "../dropdown-menu.radix";

const twins = [
  ["Base", DropdownMenuBase],
  ["Radix", DropdownMenuRadix],
] as const;

const items = [{ key: "edit", label: "Edit" }];

describe.each(twins)(
  "DropdownMenu (%s) surface animation",
  (_name, DropdownMenu) => {
    it("animates the bordered surface itself", () => {
      reduced.value = false;
      render(
        <DropdownMenu items={items} open>
          <button type="button">Menu</button>
        </DropdownMenu>
      );
      const surface = screen.getByRole("menu");
      expect(surface.classList.contains("border")).toBe(true);
      expect(surface.classList.contains("bg-popover")).toBe(true);
      expect(surface.style.opacity).not.toBe("");
      expect(Number(surface.style.opacity)).toBeLessThan(1);
    });

    it("is fully opaque from the first render with reduced motion", () => {
      reduced.value = true;
      render(
        <DropdownMenu items={items} open>
          <button type="button">Menu</button>
        </DropdownMenu>
      );
      const surface = screen.getByRole("menu");
      expect(surface.style.opacity).toBe("1");
    });
  }
);
