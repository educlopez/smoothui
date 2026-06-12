import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import GlowHover, { type GlowHoverItem } from "../index";

const items: GlowHoverItem[] = [
  { id: "one", element: <div>One</div> },
  { id: "two", element: <div>Two</div> },
];

describe("GlowHoverCard", () => {
  it("renders without throwing", () => {
    const { container } = render(<GlowHover items={items} />);
    expect(container).toBeInTheDocument();
  });
});
