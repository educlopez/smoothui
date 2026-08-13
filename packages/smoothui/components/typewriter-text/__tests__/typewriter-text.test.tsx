import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import TypewriterText from "../index";

describe("TypewriterText", () => {
  it("renders without throwing", () => {
    const { container } = render(<TypewriterText>Hello World</TypewriterText>);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TypewriterText>Hello World</TypewriterText>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
