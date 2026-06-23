import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import SmoothButton from "../index";

describe("SmoothButton", () => {
  it("renders without throwing", () => {
    const { getByRole } = render(<SmoothButton>Click me</SmoothButton>);
    expect(getByRole("button")).toBeInTheDocument();
  });

  it("renders every variant × color combination", () => {
    const variants = [
      "solid",
      "soft",
      "outline",
      "ghost",
      "link",
      "candy",
    ] as const;
    const colors = [
      "accent",
      "neutral",
      "destructive",
      "blue",
      "amber",
      "green",
    ] as const;
    for (const variant of variants) {
      for (const color of colors) {
        const { getByRole, unmount } = render(
          <SmoothButton color={color} variant={variant}>
            {variant}-{color}
          </SmoothButton>
        );
        expect(getByRole("button")).toBeInTheDocument();
        unmount();
      }
    }
  });

  it("preserves legacy variants for back-compat", () => {
    for (const variant of ["default", "secondary", "destructive"] as const) {
      const { getByRole, unmount } = render(
        <SmoothButton variant={variant}>{variant}</SmoothButton>
      );
      expect(getByRole("button")).toBeInTheDocument();
      unmount();
    }
  });

  it("sets aria-busy and disables interaction while loading", () => {
    const { getByRole } = render(<SmoothButton loading>Save</SmoothButton>);
    const button = getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
  });

  it("renders prefix and suffix slots", () => {
    const { getByTestId } = render(
      <SmoothButton
        prefix={<span data-testid="prefix" />}
        suffix={<span data-testid="suffix" />}
      >
        Label
      </SmoothButton>
    );
    expect(getByTestId("prefix")).toBeInTheDocument();
    expect(getByTestId("suffix")).toBeInTheDocument();
  });
});
