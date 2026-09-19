import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import WaveText from "../index";

describe("WaveText", () => {
  it("renders without throwing", () => {
    const { container } = render(<WaveText>Hello</WaveText>);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<WaveText>Hello</WaveText>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
