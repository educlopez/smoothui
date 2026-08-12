import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AuroraCurtain from "../index";

describe("AuroraCurtain", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <AuroraCurtain>
        <p>Content above the aurora</p>
      </AuroraCurtain>
    );
    expect(container).toBeInTheDocument();
  });

  it("renders with noise and a custom direction without throwing", () => {
    const { container } = render(
      <AuroraCurtain direction="down" noise>
        <p>Content</p>
      </AuroraCurtain>
    );
    expect(container).toBeInTheDocument();
  });
});
