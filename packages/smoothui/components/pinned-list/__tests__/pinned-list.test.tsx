import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import PinnedList, { type PinnedListItem } from "../index";

const items: PinnedListItem[] = [
  { id: "1", pinned: true, title: "Pinned item" },
  { id: "2", title: "Regular item" },
];

describe("PinnedList", () => {
  it("renders without throwing", () => {
    const { container } = render(<PinnedList items={items} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with an empty pinned message when nothing is pinned", () => {
    const { container } = render(
      <PinnedList
        emptyPinnedMessage="No pins yet"
        items={[{ id: "1", title: "Regular item" }]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
