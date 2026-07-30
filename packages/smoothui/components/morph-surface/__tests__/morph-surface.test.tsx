import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import MorphSurface from "../index";

describe("MorphSurface", () => {
  it("renders without throwing", () => {
    const { container } = render(<MorphSurface />);
    expect(container).toBeInTheDocument();
  });
});
