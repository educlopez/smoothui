import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import RansomNote from "../index";

describe("RansomNote", () => {
  it("renders without throwing", () => {
    const { container } = render(<RansomNote text="Ransom note" />);
    expect(container).toBeInTheDocument();
  });

  it("renders with the jitter animation", () => {
    const { container } = render(
      <RansomNote animate="jitter" text="Jittery note" />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<RansomNote text="Ransom note" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
