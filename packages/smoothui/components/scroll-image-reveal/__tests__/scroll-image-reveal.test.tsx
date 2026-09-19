import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ScrollImageReveal from "../index";

describe("ScrollImageReveal", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ScrollImageReveal
        alt="A landscape photo"
        src="https://example.com/landscape.png"
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with the circle mask", () => {
    const { container } = render(
      <ScrollImageReveal
        alt="A portrait photo"
        mask="circle"
        src="https://example.com/portrait.png"
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ScrollImageReveal
        alt="A landscape photo"
        src="https://example.com/landscape.png"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
