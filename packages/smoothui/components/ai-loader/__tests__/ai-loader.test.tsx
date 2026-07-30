import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import AILoader, { AI_LOADER_CYCLE_SECONDS } from "../index";

describe("AILoader", () => {
  it("exports a shared cycle length so variants stay in sync", () => {
    expect(AI_LOADER_CYCLE_SECONDS).toBeGreaterThan(0);
  });

  it("renders every variant with a status role", () => {
    for (const variant of ["dots", "bar", "grid"] as const) {
      const { container } = render(<AILoader variant={variant} />);
      expect(container.querySelector('[role="status"]')).not.toBeNull();
    }
  });

  it("always exposes a label to assistive tech", () => {
    render(<AILoader />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });

  it("uses the visible label when one is given", () => {
    render(<AILoader label="Thinking" />);
    expect(screen.getByRole("status")).toHaveTextContent("Thinking");
  });
});
