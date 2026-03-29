import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import { DotMorphButton } from "../index";

describe("DotMorphButton", () => {
  it("renders without throwing", () => {
    const { container } = render(<DotMorphButton label="Click me" />);
    expect(container).toBeInTheDocument();
  });
});
