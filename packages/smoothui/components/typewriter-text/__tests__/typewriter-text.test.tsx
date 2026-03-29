import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import TypewriterText from "../index";

describe("TypewriterText", () => {
  it("renders without throwing", () => {
    const { container } = render(<TypewriterText>Hello World</TypewriterText>);
    expect(container).toBeInTheDocument();
  });
});
