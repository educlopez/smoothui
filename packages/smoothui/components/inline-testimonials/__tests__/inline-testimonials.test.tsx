import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import InlineTestimonials, { type Testimonial } from "../index";

const testimonials: Testimonial[] = [
  {
    avatar: "https://example.com/avatar.png",
    id: "t1",
    name: "Ada Lovelace",
    quote: "This library is delightful to use.",
    rating: 5,
    role: "Engineer",
  },
];

describe("InlineTestimonials", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <InlineTestimonials
        testimonials={testimonials}
        text="Loved by {{t1}} and many more."
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with a controlled open id", () => {
    const { container } = render(
      <InlineTestimonials
        openId="t1"
        testimonials={testimonials}
        text="Loved by {{t1}}."
      />
    );
    expect(container).toBeInTheDocument();
  });
});
