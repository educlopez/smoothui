import { readFileSync } from "node:fs";
import path from "node:path";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import ContextMenu from "../index";

const items = [
  { key: "edit", label: "Edit" },
  { children: [{ key: "a", label: "Sub A" }], key: "more", label: "More" },
];

const UNDEFINED_UTILITIES =
  /animate-in|animate-out|zoom-in-|zoom-out-|fade-in-|fade-out-|slide-in-from/;

const openMenu = () => {
  render(
    <ContextMenu items={items}>
      <div>Right-click me</div>
    </ContextMenu>
  );
  fireEvent.contextMenu(screen.getByText("Right-click me"));
};

describe("ContextMenu motion", () => {
  it("does not rely on utilities that no stylesheet defines", () => {
    const source = readFileSync(
      path.join(import.meta.dirname, "..", "index.tsx"),
      "utf8"
    );
    expect(source).not.toMatch(UNDEFINED_UTILITIES);
  });

  it("renders no undefined animation utility on the open surface", async () => {
    reduced.value = false;
    openMenu();
    const surface = await screen.findByRole("menu");
    expect(surface.className).not.toMatch(UNDEFINED_UTILITIES);
    expect(surface.classList.contains("border")).toBe(true);
  });

  it("applies no scale or translate with reduced motion", async () => {
    reduced.value = true;
    openMenu();
    const surface = await screen.findByRole("menu");
    expect(surface.style.opacity).toBe("1");
    expect(surface.style.transform).toBe("");
  });

  it("has an exit path: the surface outlives the close, then unmounts", async () => {
    reduced.value = false;
    const user = userEvent.setup();
    openMenu();
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull(), {
      timeout: 2000,
    });
  });

  it("removes the surface at once with reduced motion", async () => {
    reduced.value = true;
    const user = userEvent.setup();
    openMenu();
    await screen.findByRole("menu");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });
});
