import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import HoverImageList from "../index";

describe("HoverImageList", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <HoverImageList
        items={[
          {
            alt: "First item",
            id: "1",
            image: "https://example.com/one.png",
            title: "First",
          },
          {
            alt: "Second item",
            href: "#second",
            id: "2",
            image: "https://example.com/two.png",
            meta: "2024",
            title: "Second",
          },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <HoverImageList
        items={[
          {
            alt: "First item",
            id: "1",
            image: "https://example.com/one.png",
            title: "First",
          },
          {
            alt: "Second item",
            href: "#second",
            id: "2",
            image: "https://example.com/two.png",
            meta: "2024",
            title: "Second",
          },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with fixed reveal mode", () => {
    const { container } = render(
      <HoverImageList
        items={[
          {
            alt: "Only item",
            id: "1",
            image: "https://example.com/one.png",
            title: "Only",
          },
        ]}
        revealMode="fixed"
      />
    );
    expect(container).toBeInTheDocument();
  });
});
