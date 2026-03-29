import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import WaveText from "../index";

describe("WaveText", () => {
  it("renders without throwing", () => {
    const { container } = render(<WaveText>Hello</WaveText>);
    expect(container).toBeInTheDocument();
  });
});
