import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import Sidebar, {
  SidebarContent,
  SidebarLabel,
  SidebarProvider,
  SidebarTrigger,
} from "../index";

const renderSidebar = () =>
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarLabel>Reports</SidebarLabel>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  );

const labelOf = () => screen.getByText("Reports");

describe("SidebarLabel while collapsing", () => {
  it("fades with the width before turning screen-reader-only", async () => {
    reduced.value = false;
    const user = userEvent.setup();
    renderSidebar();
    expect(labelOf().classList.contains("sr-only")).toBe(false);
    expect(labelOf().classList.contains("transition-opacity")).toBe(true);

    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(labelOf().classList.contains("sr-only")).toBe(false);
    expect(labelOf().classList.contains("opacity-0")).toBe(true);

    await waitFor(() =>
      expect(labelOf().classList.contains("sr-only")).toBe(true)
    );
  });

  it("is hidden at once with reduced motion", async () => {
    reduced.value = true;
    const user = userEvent.setup();
    renderSidebar();
    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(labelOf().classList.contains("sr-only")).toBe(true);
    expect(labelOf().classList.contains("transition-opacity")).toBe(false);
  });

  it("shows the label again when the sidebar expands", async () => {
    reduced.value = false;
    const user = userEvent.setup();
    renderSidebar();
    await user.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    await waitFor(() =>
      expect(labelOf().classList.contains("sr-only")).toBe(true)
    );
    await user.click(screen.getByRole("button", { name: "Expand sidebar" }));
    expect(labelOf().classList.contains("sr-only")).toBe(false);
    expect(labelOf().classList.contains("opacity-0")).toBe(false);
  });
});
