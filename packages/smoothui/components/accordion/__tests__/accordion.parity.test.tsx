import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";

const reduced = vi.hoisted(() => ({ value: false }));

vi.mock("motion/react", async () => {
  const actual =
    await vi.importActual<typeof import("motion/react")>("motion/react");
  return { ...actual, useReducedMotion: () => reduced.value };
});

import * as Base from "../accordion.base";
import * as Radix from "../accordion.radix";

const twins = [
  ["Base", Base],
  ["Radix", Radix],
] as const;

const CLOSE_VARIANT = /^(data-ending-style|data-\[state=closed\]):/;

const closeTokens = (el: Element) =>
  el.className
    .split(" ")
    .filter((token) => CLOSE_VARIANT.test(token))
    .map((token) => token.replace(CLOSE_VARIANT, ""));

describe.each(twins)("Accordion (%s) parity", (_name, A) => {
  const renderAccordion = (defaultValue: string[]) =>
    render(
      <A.AccordionRoot defaultValue={defaultValue}>
        <A.AccordionItem value="one">
          <A.AccordionHeader>
            <A.AccordionTrigger>One</A.AccordionTrigger>
          </A.AccordionHeader>
          <A.AccordionPanel>
            <p>Body</p>
          </A.AccordionPanel>
        </A.AccordionItem>
      </A.AccordionRoot>
    );

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

  it("collapses height and fades on close with a height transition", () => {
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
  });

  it("drops the transition with reduced motion", () => {
    reduced.value = true;
    renderAccordion(["one"]);
    const panel = document.querySelector(
      '[data-slot="accordion-panel"]'
    ) as Element;
    expect(panel.className).not.toContain("transition-[height");
    expect(panel.className).not.toContain("duration-200");
  });
});

describe("Accordion (Radix) close animation", () => {
  it("keeps the closed panel mounted so the transition can play", () => {
    reduced.value = false;
    render(
      <Radix.AccordionRoot defaultValue={[]}>
        <Radix.AccordionItem value="one">
          <Radix.AccordionHeader>
            <Radix.AccordionTrigger>One</Radix.AccordionTrigger>
          </Radix.AccordionHeader>
          <Radix.AccordionPanel>
            <p>Body</p>
          </Radix.AccordionPanel>
        </Radix.AccordionItem>
      </Radix.AccordionRoot>
    );
    const panel = document.querySelector('[data-slot="accordion-panel"]');
    expect(panel).not.toBeNull();
    expect(panel?.getAttribute("data-state")).toBe("closed");
    expect(panel?.className).toContain("data-[state=closed]:invisible");
  });

  it("hides the closed panel outright with reduced motion", () => {
    reduced.value = true;
    render(
      <Radix.AccordionRoot defaultValue={[]}>
        <Radix.AccordionItem value="one">
          <Radix.AccordionHeader>
            <Radix.AccordionTrigger>One</Radix.AccordionTrigger>
          </Radix.AccordionHeader>
          <Radix.AccordionPanel>
            <p>Body</p>
          </Radix.AccordionPanel>
        </Radix.AccordionItem>
      </Radix.AccordionRoot>
    );
    const panel = document.querySelector('[data-slot="accordion-panel"]');
    expect(panel?.className).toContain("data-[state=closed]:hidden");
  });
});
