import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import GlowHover, { type GlowHoverItem } from "../index";

const items: GlowHoverItem[] = [
  { element: <div>One</div>, id: "one" },
  { element: <div>Two</div>, id: "two" },
];

describe("GlowHoverCard", () => {
  it("renders without throwing", () => {
    const { container } = render(<GlowHover items={items} />);
    expect(container).toBeInTheDocument();
  });
});
