import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import DropdownMenu from "../dropdown-menu.radix";

const items = [
  { key: "edit", label: "Edit" },
  { children: [{ key: "a", label: "Sub A" }], key: "more", label: "More" },
];

const UNDEFINED_UTILITIES =
  /animate-in|animate-out|zoom-in-|zoom-out-|fade-in-|fade-out-|slide-in-from/;

describe("DropdownMenu (Radix) motion", () => {
  it("does not rely on utilities that no stylesheet defines", () => {
    const source = readFileSync(
      path.join(import.meta.dirname, "..", "dropdown-menu.radix.tsx"),
      "utf8"
    );
    expect(source).not.toMatch(UNDEFINED_UTILITIES);
  });

  it("renders no undefined animation utility on the open surface", () => {
    reduced.value = false;
    render(
      <DropdownMenu items={items} open>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    expect(screen.getByRole("menu").className).not.toMatch(UNDEFINED_UTILITIES);
  });

  it("applies no scale or translate with reduced motion", () => {
    reduced.value = true;
    render(
      <DropdownMenu items={items} open>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    const surface = screen.getByRole("menu");
    expect(surface.style.opacity).toBe("1");
    expect(surface.style.transform).toBe("");
  });

  it("has an exit path: the surface outlives the close, then unmounts", async () => {
    reduced.value = false;
    const { rerender } = render(
      <DropdownMenu items={items} open>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    expect(screen.getByRole("menu")).toBeInTheDocument();
    rerender(
      <DropdownMenu items={items} open={false}>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    expect(screen.queryByRole("menu")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull(), {
      timeout: 2000,
    });
  });

  it("removes the surface at once with reduced motion", async () => {
    reduced.value = true;
    const { rerender } = render(
      <DropdownMenu items={items} open>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    rerender(
      <DropdownMenu items={items} open={false}>
        <button type="button">Menu</button>
      </DropdownMenu>
    );
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });
});
