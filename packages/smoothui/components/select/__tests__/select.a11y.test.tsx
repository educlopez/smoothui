import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import { axe } from "vitest-axe";
import Select from "../index";

const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
];

describe("Select a11y", () => {
  it("has no accessibility violations in closed state", async () => {
    const { container } = render(
      <Select
        options={options}
        aria-label="Choose a fruit"
        placeholder="Pick a fruit"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when disabled", async () => {
    const { container } = render(
      <Select
        options={options}
        disabled
        aria-label="Disabled select"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
