import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Scrubber from "../index";

describe("Scrubber", () => {
  it("renders without throwing", () => {
    const { container } = render(<Scrubber />);
    expect(container).toBeInTheDocument();
  });
});
