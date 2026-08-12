import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import UnlockFaceId from "../index";

describe("UnlockFaceId", () => {
  it("renders without throwing", () => {
    const { container } = render(<UnlockFaceId />);
    expect(container).toBeInTheDocument();
  });

  it("renders the unlocked success variant without throwing", () => {
    const { container } = render(
      <UnlockFaceId status="success">
        <p>Secret content</p>
      </UnlockFaceId>
    );
    expect(container).toBeInTheDocument();
  });
});
