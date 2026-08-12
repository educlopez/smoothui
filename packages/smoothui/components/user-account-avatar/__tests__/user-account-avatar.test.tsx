import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import UserAccountAvatar from "../index";

describe("UserAccountAvatar", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <UserAccountAvatar
        user={{
          avatar: "/avatar.jpg",
          email: "test@example.com",
          name: "Test User",
        }}
      />
    );
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <UserAccountAvatar
        user={{
          avatar: "/avatar.jpg",
          email: "test@example.com",
          name: "Test User",
        }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
