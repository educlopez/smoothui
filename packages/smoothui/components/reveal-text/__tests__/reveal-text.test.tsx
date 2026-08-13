import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import RevealText from "../index";

describe("RevealText", () => {
  it("renders without throwing", () => {
    const { container } = render(<RevealText>Hello World</RevealText>);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<RevealText>Hello World</RevealText>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
