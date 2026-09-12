import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import type { AIState } from "../../ai-core";
import AIOrbFace from "../index";

const ALL_STATES: AIState[] = [
  "idle",
  "listening",
  "thinking",
  "streaming",
  "done",
  "error",
];

const countEyeRects = (container: HTMLElement) =>
  [...container.querySelectorAll("rect")].length;

describe("AIOrbFace", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AIOrbFace aria-label="Assistant is thinking" state="thinking" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders in every state without throwing", () => {
    for (const state of ALL_STATES) {
      const { container } = render(<AIOrbFace state={state} />);
      expect(container.querySelector("svg")).not.toBeNull();
    }
  });

  it("closes the eyes into wide lozenges when it is pleased", () => {
    // Every expression is the same two capsules; "done" is short and wide
    // rather than a different shape entirely.
    const idle = render(<AIOrbFace state="idle" />);
    const done = render(<AIOrbFace state="done" />);
    expect(countEyeRects(done.container)).toBe(2);

    const h = (c: HTMLElement) =>
      Number(c.querySelector("rect")?.getAttribute("height") ?? 0);
    const w = (c: HTMLElement) =>
      Number(c.querySelector("rect")?.getAttribute("width") ?? 0);
    expect(h(done.container)).toBeLessThan(h(idle.container));
    expect(w(done.container)).toBeGreaterThan(w(idle.container));
  });

  it("shows spiral eyes while broken, and keeps them for as long as the state lasts", () => {
    const { container } = render(<AIOrbFace state="error" />);
    expect(countEyeRects(container)).toBe(0);
    expect(container.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it("narrows while streaming and widens while listening", () => {
    const streaming = render(<AIOrbFace state="streaming" />);
    const idle = render(<AIOrbFace state="idle" />);
    const listening = render(<AIOrbFace state="listening" />);

    const heightOf = (container: HTMLElement) =>
      Number(container.querySelector("rect")?.getAttribute("height") ?? 0);

    expect(heightOf(streaming.container)).toBeLessThan(
      heightOf(idle.container)
    );
    expect(heightOf(idle.container)).toBeLessThan(
      heightOf(listening.container)
    );
  });

  it("is asymmetric while thinking", () => {
    // Doubt is the two eyes disagreeing — the whole reason each eye carries its
    // own shape rather than the pair sharing one.
    const { container } = render(<AIOrbFace state="thinking" />);
    const [left, right] = [...container.querySelectorAll("rect")];
    expect(left.getAttribute("height")).not.toBe(right.getAttribute("height"));
  });

  it("takes an expression directly, overriding state", () => {
    const { container } = render(
      <AIOrbFace expression="surprised" state="idle" />
    );
    const idle = render(<AIOrbFace state="idle" />);
    const w = (c: HTMLElement) =>
      Number(c.querySelector("rect")?.getAttribute("width") ?? 0);
    expect(w(container)).toBeLessThan(w(idle.container));
  });

  it("accepts a pair of eye shapes that is not a preset", () => {
    const { container } = render(
      <AIOrbFace
        expression={{ left: { h: 0.2, w: 2 }, right: { h: 1, w: 1 } }}
      />
    );
    const [left, right] = [...container.querySelectorAll("rect")];
    expect(Number(left.getAttribute("width"))).toBeGreaterThan(
      Number(right.getAttribute("width"))
    );
  });

  it("renders the body through Orb, beneath the face", () => {
    const { container } = render(<AIOrbFace />);
    // jsdom has no WebGL2, so Orb falls back to a CSS stand-in. What matters
    // is that the body comes before the SVG: painted after, it would cover the
    // shader on every machine that can run it.
    const root = container.firstElementChild;
    const [body, face] = [...(root?.children ?? [])];
    expect(body?.tagName.toLowerCase()).toBe("div");
    expect(face?.tagName.toLowerCase()).toBe("svg");
  });

  it("has no mouth", () => {
    const { container } = render(<AIOrbFace state="idle" />);
    // The eyes carry the expression. A drawn mouth over a shader body read as
    // a sticker stuck on it.
    expect(container.querySelectorAll("path, line")).toHaveLength(0);
  });

  it("stays hidden from assistive tech when it is decorative", () => {
    const { container } = render(<AIOrbFace />);
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
      "true"
    );
  });

  it("becomes a labelled image when given an aria-label", () => {
    render(<AIOrbFace aria-label="Assistant is thinking" state="thinking" />);
    expect(
      screen.getByRole("img", { name: "Assistant is thinking" })
    ).toBeInTheDocument();
  });
});
