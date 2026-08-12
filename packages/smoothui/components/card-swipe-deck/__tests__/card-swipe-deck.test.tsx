import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import CardSwipeDeck, { type CardSwipeDeckItem } from "../index";

const items: CardSwipeDeckItem[] = [
  { content: <p>Card one</p>, id: "card-1" },
  { content: <p>Card two</p>, id: "card-2" },
];

describe("CardSwipeDeck", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<CardSwipeDeck items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<CardSwipeDeck items={items} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with custom labels without throwing", () => {
    const { container } = render(
      <CardSwipeDeck items={items} labels={{ left: "Skip", right: "Save" }} />
    );
    expect(container).toBeInTheDocument();
  });
});
