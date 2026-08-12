import { describe, expect, it } from "vitest";
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
});
