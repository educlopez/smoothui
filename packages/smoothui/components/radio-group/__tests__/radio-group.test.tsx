import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import RadioGroup, { Radio } from "../index";

describe("RadioGroup", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <RadioGroup defaultValue="a">
        <Radio value="a">Option A</Radio>
        <Radio value="b">Option B</Radio>
      </RadioGroup>
    );
    expect(container).toBeInTheDocument();
  });
});
