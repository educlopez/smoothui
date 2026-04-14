import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedStepper from "../index";

describe("AnimatedStepper", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AnimatedStepper
        steps={[{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
