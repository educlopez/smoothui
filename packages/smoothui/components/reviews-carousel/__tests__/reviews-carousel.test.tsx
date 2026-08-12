import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ReviewsCarousel from "../index";

describe("ReviewsCarousel", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ReviewsCarousel
        reviews={[
          { author: "Alice", body: "Great!", id: "1", title: "Review 1" },
          { author: "Bob", body: "Nice!", id: "2", title: "Review 2" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ReviewsCarousel
        reviews={[
          { author: "Alice", body: "Great!", id: "1", title: "Review 1" },
          { author: "Bob", body: "Nice!", id: "2", title: "Review 2" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
