import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ScrollableCardStack from "../index";

describe("ScrollableCardStack", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ScrollableCardStack
        items={[
          {
            id: "1",
            name: "Test User",
            handle: "@test",
            avatar: "/avatar.jpg",
            image: "/image.jpg",
            href: "#",
          },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
