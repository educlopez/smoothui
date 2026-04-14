import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Checkbox from "../index";

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
});
