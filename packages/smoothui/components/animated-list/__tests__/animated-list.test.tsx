import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedList, { type AnimatedListItem } from "../index";

const items: AnimatedListItem[] = [
  { content: "First notification", id: "item-1" },
  { content: "Second notification", id: "item-2" },
  { content: "Third notification", id: "item-3" },
];

describe("AnimatedList", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<AnimatedList items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<AnimatedList items={items} />);
    expect(container).toBeInTheDocument();
  });

  it("renders in feed mode without throwing", () => {
    const { container } = render(
      <AnimatedList direction="up" feed items={items} />
    );
    expect(container).toBeInTheDocument();
  });
});
