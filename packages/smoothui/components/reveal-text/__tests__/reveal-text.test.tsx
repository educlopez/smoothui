import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import RevealText from "../index";

describe("RevealText", () => {
  it("renders without throwing", () => {
    const { container } = render(<RevealText>Hello World</RevealText>);
    expect(container).toBeInTheDocument();
  });
});
