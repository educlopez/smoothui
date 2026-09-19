import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import GlowHover, { type GlowHoverItem } from "../index";

const items: GlowHoverItem[] = [
  { element: <div>One</div>, id: "one" },
  { element: <div>Two</div>, id: "two" },
];

describe("GlowHoverCard", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<GlowHover items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<GlowHover items={items} />);
    expect(container).toBeInTheDocument();
  });
});
