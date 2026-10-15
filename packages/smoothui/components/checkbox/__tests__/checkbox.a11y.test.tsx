import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import CheckboxRadix from "../checkbox.radix";
import Checkbox from "../index";

const STATE_TEXT = /checked|indeterminate/i;

describe("Checkbox a11y", () => {
  it("has no accessibility violations when unchecked", async () => {
    const { container } = render(
      <div>
        <label htmlFor="test-cb">Accept terms</label>
        <Checkbox id="test-cb" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when checked", async () => {
    const { container } = render(
      <div>
        <label htmlFor="test-cb-checked">Accept terms</label>
        <Checkbox checked id="test-cb-checked" />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when indeterminate", async () => {
    const { container } = render(
      <div>
        <label htmlFor="test-cb-indeterminate">Select all</label>
        <Checkbox id="test-cb-indeterminate" indeterminate />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it.each([
    ["Base", Checkbox],
    ["Radix", CheckboxRadix],
  ] as const)(
    "%s: the control SVG carries no title and the name has no state text",
    (_name, Cb) => {
      const { container } = render(
        <div>
          <label htmlFor="cb-name">Accept terms</label>
          <Cb checked id="cb-name" />
        </div>
      );
      expect(container.querySelector("svg title")).toBeNull();
      expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe(
        "true"
      );
      const box = screen.getByRole("checkbox", { name: "Accept terms" });
      expect(box.textContent).not.toMatch(STATE_TEXT);
    }
  );
});
