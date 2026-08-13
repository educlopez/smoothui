import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import ScrambleHover from "../index";

describe("ScrambleHover", () => {
  it("renders without throwing", () => {
    const { container } = render(<ScrambleHover>Hello</ScrambleHover>);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ScrambleHover>Hello</ScrambleHover>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
