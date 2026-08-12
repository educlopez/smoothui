import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import SocialSelector from "../index";

describe("SocialSelector", () => {
  it("renders without throwing", () => {
    const { container } = render(<SocialSelector />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SocialSelector />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
