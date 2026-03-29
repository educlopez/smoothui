import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AgentAvatar from "../index";

describe("AgentAvatar", () => {
  it("renders without throwing", () => {
    const { container } = render(<AgentAvatar seed="test-seed" />);
    expect(container).toBeInTheDocument();
  });
});
