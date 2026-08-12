import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import ThemeToggle from "../index";

describe("ThemeToggle", () => {
  it("renders without throwing", () => {
    const { container } = render(<ThemeToggle />);
    expect(container).toBeInTheDocument();
  });

  it("renders the pill variant", () => {
    const { container } = render(<ThemeToggle variant="pill" />);
    expect(container).toBeInTheDocument();
  });

  it("renders the switch variant without the system option", () => {
    const { container } = render(
      <ThemeToggle showSystem={false} variant="switch" />
    );
    expect(container).toBeInTheDocument();
  });
});
