import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedAvatarGroup from "../index";

describe("AnimatedAvatarGroup", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AnimatedAvatarGroup
        avatars={[
          { src: "https://example.com/avatar1.png", alt: "User 1" },
          { src: "https://example.com/avatar2.png", alt: "User 2" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
