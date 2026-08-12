import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import HoverExpand, { type HoverExpandItem } from "../index";

const items: HoverExpandItem[] = [
  { id: "one", title: "First panel" },
  { id: "two", title: "Second panel" },
];

describe("HoverExpand", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<HoverExpand items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<HoverExpand items={items} />);
    expect(container).toBeInTheDocument();
  });

  it("renders the vertical orientation variant without throwing", () => {
    const { container } = render(
      <HoverExpand items={items} orientation="vertical" />
    );
    expect(container).toBeInTheDocument();
  });
});
