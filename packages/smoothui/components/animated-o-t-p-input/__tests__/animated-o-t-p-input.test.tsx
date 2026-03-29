import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AnimatedOTPInput from "../index";

describe("AnimatedOTPInput", () => {
  it("renders without throwing", () => {
    const { container } = render(<AnimatedOTPInput />);
    expect(container).toBeInTheDocument();
  });
});
