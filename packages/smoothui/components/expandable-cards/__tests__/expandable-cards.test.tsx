import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ExpandableCards from "../index";

describe("ExpandableCards", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ExpandableCards
        cards={[
          { id: 1, title: "Card 1", image: "/test.jpg", content: "Content 1" },
          { id: 2, title: "Card 2", image: "/test.jpg", content: "Content 2" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
