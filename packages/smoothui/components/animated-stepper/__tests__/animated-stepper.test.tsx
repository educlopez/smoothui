import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedStepper from "../index";

describe("AnimatedStepper", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AnimatedStepper
        steps={[{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <AnimatedStepper
        steps={[{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
