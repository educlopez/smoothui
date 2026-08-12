import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import FloatingNavbar from "../index";

describe("FloatingNavbar", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <FloatingNavbar
        items={[
          { href: "#home", id: "home", label: "Home" },
          { id: "about", label: "About" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders at the bottom without hide-on-scroll", () => {
    const { container } = render(
      <FloatingNavbar
        hideOnScroll={false}
        items={[{ id: "home", label: "Home" }]}
        position="bottom"
      />
    );
    expect(container).toBeInTheDocument();
  });
});
