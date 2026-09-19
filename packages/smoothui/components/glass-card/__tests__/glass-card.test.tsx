import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import GlassCard from "../index";

describe("GlassCard", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<GlassCard>Card content</GlassCard>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

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
