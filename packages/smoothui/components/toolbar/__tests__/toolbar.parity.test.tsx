import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import * as Base from "../toolbar.base";
import * as Radix from "../toolbar.radix";

const twins = [
  ["Base", Base],
  ["Radix", Radix],
] as const;

const isDisabled = (el: HTMLElement) =>
  (el as HTMLButtonElement).disabled ||
  el.getAttribute("aria-disabled") === "true" ||
  el.hasAttribute("data-disabled");

describe.each(twins)("Toolbar (%s) parity", (_name, T) => {
  it("disabled on the root disables every button", () => {
    render(
      <T.default aria-label="Format" disabled>
        <T.ToolbarGroup aria-label="Style">
          <T.ToolbarButton>Bold</T.ToolbarButton>
          <T.ToolbarButton>Italic</T.ToolbarButton>
        </T.ToolbarGroup>
        <T.ToolbarSeparator />
        <T.ToolbarButton>Link</T.ToolbarButton>
      </T.default>
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(3);
    for (const button of buttons) {
      expect(isDisabled(button)).toBe(true);
    }
  });

  it("leaves buttons enabled by default", () => {
    render(
      <T.default aria-label="Format">
        <T.ToolbarButton>Bold</T.ToolbarButton>
      </T.default>
    );
    expect(isDisabled(screen.getByRole("button", { name: "Bold" }))).toBe(
      false
    );
  });

  it("keeps the input reachable with Tab", async () => {
    const user = userEvent.setup();
    render(
      <T.default aria-label="Format">
        <T.ToolbarButton>Bold</T.ToolbarButton>
        <T.ToolbarInput aria-label="Search" />
        <T.ToolbarButton>Italic</T.ToolbarButton>
      </T.default>
    );
    const input = screen.getByRole("textbox", { name: "Search" });
    await user.tab();
    let reached = false;
    // Radix leaves the input as its own tab stop; Base includes it in roving
    // focus (arrow keys). Either way the keyboard reaches it.
    await user.tab();
    reached = document.activeElement === input;
    if (!reached) {
      screen.getByRole("button", { name: "Bold" }).focus();
    }
    for (let step = 0; step < 3 && !reached; step += 1) {
      await user.keyboard("{ArrowRight}");
      reached = document.activeElement === input;
    }
    expect(reached).toBe(true);
  });

  it("exposes data-slot on every part", () => {
    render(
      <T.default aria-label="Format">
        <T.ToolbarGroup aria-label="Style">
          <T.ToolbarButton>Bold</T.ToolbarButton>
        </T.ToolbarGroup>
        <T.ToolbarSeparator />
        <T.ToolbarLink href="#help">Help</T.ToolbarLink>
        <T.ToolbarInput aria-label="Search" />
      </T.default>
    );
    for (const slot of [
      "toolbar",
      "toolbar-group",
      "toolbar-button",
      "toolbar-separator",
      "toolbar-link",
      "toolbar-input",
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
  });
});

describe("Toolbar (Radix) disabled opt-out", () => {
  it("lets one button opt out of the root's disabled state", () => {
    render(
      <Radix.default aria-label="Format" disabled>
        <Radix.ToolbarButton>Bold</Radix.ToolbarButton>
        <Radix.ToolbarButton disabled={false}>Help</Radix.ToolbarButton>
      </Radix.default>
    );
    expect(isDisabled(screen.getByRole("button", { name: "Bold" }))).toBe(true);
    expect(isDisabled(screen.getByRole("button", { name: "Help" }))).toBe(
      false
    );
  });
});
