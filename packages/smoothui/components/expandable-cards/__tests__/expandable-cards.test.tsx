import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ExpandableCards from "../index";

describe("ExpandableCards", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <ExpandableCards
        cards={[
          { content: "Content 1", id: 1, image: "/test.jpg", title: "Card 1" },
          { content: "Content 2", id: 2, image: "/test.jpg", title: "Card 2" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <ExpandableCards
        cards={[
          { content: "Content 1", id: 1, image: "/test.jpg", title: "Card 1" },
          { content: "Content 2", id: 2, image: "/test.jpg", title: "Card 2" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
