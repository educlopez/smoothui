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
