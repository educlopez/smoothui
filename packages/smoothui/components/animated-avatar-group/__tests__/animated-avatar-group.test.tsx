import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AnimatedAvatarGroup from "../index";

describe("AnimatedAvatarGroup", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AnimatedAvatarGroup
        avatars={[
          { alt: "User 1", src: "https://example.com/avatar1.png" },
          { alt: "User 2", src: "https://example.com/avatar2.png" },
        ]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <AnimatedAvatarGroup
        avatars={[
          { alt: "User 1", src: "https://example.com/avatar1.png" },
          { alt: "User 2", src: "https://example.com/avatar2.png" },
        ]}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
