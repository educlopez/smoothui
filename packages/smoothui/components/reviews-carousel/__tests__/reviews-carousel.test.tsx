import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ReviewsCarousel from "../index";

describe("ReviewsCarousel", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ReviewsCarousel
        reviews={[
          { id: "1", body: "Great!", author: "Alice", title: "Review 1" },
          { id: "2", body: "Nice!", author: "Bob", title: "Review 2" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
