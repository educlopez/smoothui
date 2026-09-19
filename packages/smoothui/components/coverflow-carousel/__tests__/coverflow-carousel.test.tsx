import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import CoverflowCarousel from "../index";

describe("CoverflowCarousel", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <CoverflowCarousel
        items={[
          { id: "1", image: "https://example.com/one.png" },
          { id: "2", image: "https://example.com/two.png" },
          { content: "Third slide", id: "3" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <CoverflowCarousel
        items={[
          { id: "1", image: "https://example.com/one.png" },
          { id: "2", image: "https://example.com/two.png" },
          { content: "Third slide", id: "3" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with loop and autoplay enabled", () => {
    const { container } = render(
      <CoverflowCarousel
        autoplay
        items={[
          { content: "First", id: "1" },
          { content: "Second", id: "2" },
        ]}
        loop
      />
    );
    expect(container).toBeInTheDocument();
  });
});
