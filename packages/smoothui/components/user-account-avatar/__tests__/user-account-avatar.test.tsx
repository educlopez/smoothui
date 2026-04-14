import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import UserAccountAvatar from "../index";

describe("UserAccountAvatar", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <UserAccountAvatar
        user={{
          name: "Test User",
          email: "test@example.com",
          avatar: "/avatar.jpg",
        }}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
