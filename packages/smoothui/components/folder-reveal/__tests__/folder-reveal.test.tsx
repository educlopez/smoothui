import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import FolderReveal, { type FolderRevealItem } from "../index";

const items: FolderRevealItem[] = [
  { content: <p>Card one</p>, id: "card-1" },
  { content: <p>Card two</p>, id: "card-2" },
];

describe("FolderReveal", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<FolderReveal items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(<FolderReveal items={items} />);
    expect(container).toBeInTheDocument();
  });

  it("renders open with a click trigger without throwing", () => {
    const { container } = render(
      <FolderReveal items={items} open trigger="click" />
    );
    expect(container).toBeInTheDocument();
  });
});
