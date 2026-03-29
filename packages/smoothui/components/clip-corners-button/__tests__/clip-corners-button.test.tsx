import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import { ClipCornersButton } from "../index";

describe("ClipCornersButton", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <ClipCornersButton>Click me</ClipCornersButton>
    );
    expect(container).toBeInTheDocument();
  });
});
