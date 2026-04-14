import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Combobox from "../index";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];

describe("Combobox a11y", () => {
  it("has no accessibility violations in closed state", async () => {
    const { container } = render(
      <Combobox
        aria-label="Choose a framework"
        options={options}
        placeholder="Select framework…"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
