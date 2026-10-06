import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import * as Base from "../accordion.base";
import * as Radix from "../accordion.radix";

const panelBody = (A: typeof Base | typeof Radix) => (
  <A.AccordionItem value="one">
    <A.AccordionHeader>
      <A.AccordionTrigger>One</A.AccordionTrigger>
    </A.AccordionHeader>
    <A.AccordionPanel>
      <p>Body</p>
    </A.AccordionPanel>
  </A.AccordionItem>
);

const renderBase = (defaultValue: string[]) =>
  render(
    <Base.AccordionRoot defaultValue={defaultValue}>
      {panelBody(Base)}
    </Base.AccordionRoot>
  );

const renderRadix = (defaultValue: string[]) =>
  render(
    <Radix.AccordionRoot defaultValue={defaultValue} type="multiple">
      {panelBody(Radix)}
    </Radix.AccordionRoot>
  );

const twins = [
  ["Base", renderBase],
  ["Radix", renderRadix],
] as const;

const CLOSE_VARIANT = /^(data-ending-style|data-\[state=closed\]):/;

const closeTokens = (el: Element) =>
  el.className
    .split(" ")
    .filter((token) => CLOSE_VARIANT.test(token))
    .map((token) => token.replace(CLOSE_VARIANT, ""));

describe.each(twins)("Accordion (%s) parity", (name, renderAccordion) => {
  it("exposes data-slot on every part", () => {
    reduced.value = false;
    renderAccordion(["one"]);
    for (const slot of [
      "accordion",
      "accordion-item",
      "accordion-header",
      "accordion-trigger",
      "accordion-panel",
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)).not.toBeNull();
    }
  });

  // Radix animates height with Motion (see the close animation block below).
  it.runIf(name === "Base")(
    "collapses height and fades on close with a height transition",
    () => {
      reduced.value = false;
      renderAccordion(["one"]);
      const panel = document.querySelector('[data-slot="accordion-panel"]');
      expect(panel).not.toBeNull();
      const tokens = closeTokens(panel as Element);
      expect(tokens).toContain("h-0");
      expect(tokens).toContain("opacity-0");
      expect((panel as Element).className).toContain(
        "transition-[height,opacity"
      );
    }
  );

  it.runIf(name === "Base")("drops the transition with reduced motion", () => {
    reduced.value = true;
    renderAccordion(["one"]);
    const panel = document.querySelector(
      '[data-slot="accordion-panel"]'
    ) as Element;
    expect(panel.className).not.toContain("transition-[height");
    expect(panel.className).not.toContain("duration-200");
  });
});

const renderPanel = (defaultValue: string[]) =>
  render(
    <Radix.AccordionRoot defaultValue={defaultValue} type="multiple">
      <Radix.AccordionItem value="one">
        <Radix.AccordionHeader>
          <Radix.AccordionTrigger>Toggle</Radix.AccordionTrigger>
        </Radix.AccordionHeader>
        <Radix.AccordionPanel>
          <button type="button">Inside</button>
        </Radix.AccordionPanel>
      </Radix.AccordionItem>
    </Radix.AccordionRoot>
  );

const panelEl = () =>
  document.querySelector('[data-slot="accordion-panel"]') as HTMLElement;

describe("Accordion (Radix) height animation", () => {
  it("closed: height 0, transparent, out of the a11y tree and tab order", () => {
    reduced.value = false;
    renderPanel([]);
    const panel = panelEl();
    expect(panel.getAttribute("data-state")).toBe("closed");
    expect(panel.style.height).toBe("0px");
    expect(panel.style.opacity).toBe("0");
    expect(panel.style.visibility).toBe("hidden");
    expect(panel).toHaveAttribute("aria-hidden", "true");
    expect(panel).toHaveAttribute("inert");
    expect(screen.queryByRole("button", { name: "Inside" })).toBeNull();
  });

  it("open: auto height, opaque, reachable", () => {
    reduced.value = false;
    renderPanel(["one"]);
    const panel = panelEl();
    expect(panel.getAttribute("data-state")).toBe("open");
    expect(panel.style.height).toBe("auto");
    expect(panel.style.opacity).toBe("1");
    expect(panel.style.visibility).toBe("visible");
    expect(panel).not.toHaveAttribute("aria-hidden");
    expect(panel).not.toHaveAttribute("inert");
    expect(screen.getByRole("button", { name: "Inside" })).toBeVisible();
  });

  it("animates the target values when toggled", async () => {
    reduced.value = false;
    const user = userEvent.setup();
    renderPanel([]);
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => expect(panelEl().style.height).toBe("auto"));
    await waitFor(() => expect(panelEl().style.opacity).toBe("1"));
    expect(panelEl()).not.toHaveAttribute("inert");
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    await waitFor(() => expect(panelEl().style.height).toBe("0px"));
    await waitFor(() => expect(panelEl().style.visibility).toBe("hidden"));
    expect(panelEl()).toHaveAttribute("inert");
  });

  it("applies the same targets with reduced motion", () => {
    reduced.value = true;
    renderPanel([]);
    expect(panelEl().style.height).toBe("0px");
    expect(panelEl().style.opacity).toBe("0");
  });
});
