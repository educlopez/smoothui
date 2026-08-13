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

  it("swaps the plain eyes out for arcs when it is pleased", () => {
    const idle = render(<AIOrbFace state="idle" />);
    expect(countEyeRects(idle.container)).toBe(2);

    const done = render(<AIOrbFace state="done" />);
    expect(countEyeRects(done.container)).toBe(0);
    expect(done.container.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it("shows spiral eyes while broken, and keeps them for as long as the state lasts", () => {
    const { container } = render(<AIOrbFace state="error" />);
    expect(countEyeRects(container)).toBe(0);
    expect(container.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it("squints while thinking and widens while listening", () => {
    const thinking = render(<AIOrbFace state="thinking" />);
    const streaming = render(<AIOrbFace state="streaming" />);
    const listening = render(<AIOrbFace state="listening" />);

    const heightOf = (container: HTMLElement) =>
      Number(container.querySelector("rect")?.getAttribute("height") ?? 0);

    expect(heightOf(thinking.container)).toBeLessThan(
      heightOf(streaming.container)
    );
    expect(heightOf(streaming.container)).toBeLessThan(
      heightOf(listening.container)
    );
  });

  it("gives each instance its own gradient id", () => {
    const { container } = render(
      <>
        <AIOrbFace />
        <AIOrbFace />
      </>
    );
    const ids = [...container.querySelectorAll("radialGradient")].map(
      (node) => node.id
    );
    expect(new Set(ids).size).toBe(2);
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
