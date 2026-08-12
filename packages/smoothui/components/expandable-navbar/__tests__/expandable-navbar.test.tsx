import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ExpandableNavbar, { type ExpandableNavbarItem } from "../index";

const items: ExpandableNavbarItem[] = [
  { id: "home", label: "Home", panel: <p>Home panel</p> },
  { id: "about", label: "About", panel: <p>About panel</p> },
];

describe("ExpandableNavbar", () => {
  it("renders without throwing", () => {
    const { container } = render(<ExpandableNavbar items={items} />);
    expect(container).toBeInTheDocument();
  });

  it("renders with a controlled open panel without throwing", () => {
    const { container } = render(
      <ExpandableNavbar items={items} openId="about" />
    );
    expect(container).toBeInTheDocument();
  });
});
