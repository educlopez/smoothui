import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SiriOrb from "../index";

describe("SiriOrb", () => {
  it("renders without throwing", () => {
    const { container } = render(<SiriOrb />);
    expect(container).toBeInTheDocument();
  });
});
