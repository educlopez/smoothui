import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SocialSelector from "../index";

describe("SocialSelector", () => {
  it("renders without throwing", () => {
    const { container } = render(<SocialSelector />);
    expect(container).toBeInTheDocument();
  });
});
