import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import { ClipCornersButton } from "../index";

describe("ClipCornersButton", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <ClipCornersButton>Click me</ClipCornersButton>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <ClipCornersButton>Click me</ClipCornersButton>
    );
    expect(container).toBeInTheDocument();
  });
});
