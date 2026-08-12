import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import GlassCard from "../index";

describe("GlassCard", () => {
  it("renders without throwing", () => {
    const { container } = render(<GlassCard>Card content</GlassCard>);
    expect(container).toBeInTheDocument();
  });

  it("renders without interactive tracking", () => {
    const { container } = render(
      <GlassCard interactive={false} specular={false}>
        Static content
      </GlassCard>
    );
    expect(container).toBeInTheDocument();
  });
});
