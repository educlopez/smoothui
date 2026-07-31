import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AppleInvites, { type Event } from "../index";

const events: Event[] = [
  {
    id: 1,
    image: "https://example.com/a.jpg",
    location: "Madrid",
    title: "Launch party",
  },
  {
    id: 2,
    image: "https://example.com/b.jpg",
    location: "Barcelona",
    title: "Demo day",
  },
];

describe("AppleInvites", () => {
  it("renders without throwing", () => {
    const { container } = render(<AppleInvites events={events} />);
    expect(container).toBeInTheDocument();
  });
});
