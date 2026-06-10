import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AppleInvites, { type Event } from "../index";

const events: Event[] = [
  {
    id: 1,
    title: "Launch party",
    location: "Madrid",
    image: "https://example.com/a.jpg",
  },
  {
    id: 2,
    title: "Demo day",
    location: "Barcelona",
    image: "https://example.com/b.jpg",
  },
];

describe("AppleInvites", () => {
  it("renders without throwing", () => {
    const { container } = render(<AppleInvites events={events} />);
    expect(container).toBeInTheDocument();
  });
});
