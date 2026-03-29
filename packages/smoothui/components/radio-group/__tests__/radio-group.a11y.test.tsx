import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import { axe } from "vitest-axe";
import RadioGroup, { Radio } from "../index";

describe("RadioGroup a11y", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadioGroup defaultValue="a" aria-label="Test options">
        <Radio value="a" id="opt-a">Option A</Radio>
        <Radio value="b" id="opt-b">Option B</Radio>
        <Radio value="c" id="opt-c">Option C</Radio>
      </RadioGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when disabled", async () => {
    const { container } = render(
      <RadioGroup defaultValue="a" disabled aria-label="Disabled options">
        <Radio value="a" id="dis-a">Option A</Radio>
        <Radio value="b" id="dis-b">Option B</Radio>
      </RadioGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
