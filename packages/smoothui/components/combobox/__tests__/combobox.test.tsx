import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Combobox from "../index";

describe("Combobox", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Combobox
        aria-label="Test combobox"
        options={[
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <Combobox
        aria-label="Test combobox"
        options={[
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
