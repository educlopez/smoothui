import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Phototab from "../index";

describe("Phototab", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <Phototab
        tabs={[{ icon: <span>icon</span>, image: "/test.jpg", name: "Tab 1" }]}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Phototab
        tabs={[{ icon: <span>icon</span>, image: "/test.jpg", name: "Tab 1" }]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
