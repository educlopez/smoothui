import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import RadioGroup, { Radio } from "../index";

describe("RadioGroup a11y", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <RadioGroup aria-label="Test options" defaultValue="a">
        <Radio id="opt-a" value="a">
          Option A
        </Radio>
        <Radio id="opt-b" value="b">
          Option B
        </Radio>
        <Radio id="opt-c" value="c">
          Option C
        </Radio>
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // `id` is optional on Radio, and every case above supplies one. Without a
  // generated fallback the label's htmlFor resolved to nothing and the radio
  // was left with no accessible name at all.
  it("has no accessibility violations without explicit ids", async () => {
    const { container } = render(
      <RadioGroup aria-label="Unlabelled options" defaultValue="a">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when disabled", async () => {
    const { container } = render(
      <RadioGroup aria-label="Disabled options" defaultValue="a" disabled>
        <Radio id="dis-a" value="a">
          Option A
        </Radio>
        <Radio id="dis-b" value="b">
          Option B
        </Radio>
      </RadioGroup>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
