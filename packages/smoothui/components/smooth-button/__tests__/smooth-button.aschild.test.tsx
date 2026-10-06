import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "../../../test-utils/render";
import SmoothButton from "../smooth-button.radix";

const FORCE_EVENT = "webkitmouseforcechanged";

const pressHard = (node: HTMLElement, force: number) => {
  const event = new Event(FORCE_EVENT);
  Object.assign(event, { webkitForce: force });
  node.dispatchEvent(event);
};

describe("SmoothButton (Radix) asChild", () => {
  it("hands the consumer's ref the child node", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <SmoothButton asChild ref={ref}>
        <a href="/docs">Docs</a>
      </SmoothButton>
    );
    expect(ref.current).toBe(screen.getByRole("link", { name: "Docs" }));
  });

  it("attaches forcePress to the child while keeping the consumer's ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <SmoothButton asChild forcePress ref={ref}>
        <a href="/docs">Docs</a>
      </SmoothButton>
    );
    const link = screen.getByRole("link", { name: "Docs" });
    expect(ref.current).toBe(link);
    expect(link.style.transform).toBe("");
    pressHard(link, 2);
    expect(link.style.transform).toBe("scale(0.94)");
    pressHard(link, 1);
    expect(link.style.transform).toBe("");
  });

  it("exposes data-variant on the slotted child", () => {
    render(
      <SmoothButton asChild variant="outline">
        <a href="/docs">Docs</a>
      </SmoothButton>
    );
    expect(
      screen.getByRole("link", { name: "Docs" }).getAttribute("data-variant")
    ).toBe("outline");
  });
});
