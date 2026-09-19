import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import SocialHoverCard, { type SocialProfile } from "../index";

const profile: SocialProfile = {
  avatar: "https://example.com/avatar.png",
  handle: "@smoothui",
  id: "1",
  name: "Smooth UI",
};

describe("SocialHoverCard", () => {
  it("renders without throwing", () => {
    const { container } = render(<SocialHoverCard profile={profile} />);
    expect(container).toBeInTheDocument();
  });

  it("renders in the loading state", () => {
    const { container } = render(<SocialHoverCard loading profile={profile} />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SocialHoverCard profile={profile} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
