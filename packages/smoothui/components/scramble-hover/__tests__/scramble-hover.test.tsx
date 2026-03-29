import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ScrambleHover from "../index";

describe("ScrambleHover", () => {
  it("renders without throwing", () => {
    const { container } = render(<ScrambleHover>Hello</ScrambleHover>);
    expect(container).toBeInTheDocument();
  });
});
