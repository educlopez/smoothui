import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import PerspectiveText3D from "../index";

describe("PerspectiveText3D", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <PerspectiveText3D text="Hello depth world" />
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with a scroll driver and line split without throwing", () => {
    const { container } = render(
      <PerspectiveText3D
        driver="scroll"
        split="lines"
        text={"Line one\nLine two"}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
