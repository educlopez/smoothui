import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
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
        aria-label="Choose a fruit"
        options={options}
        placeholder="Pick a fruit"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when disabled", async () => {
    const { container } = render(
      <Select aria-label="Disabled select" disabled options={options} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
