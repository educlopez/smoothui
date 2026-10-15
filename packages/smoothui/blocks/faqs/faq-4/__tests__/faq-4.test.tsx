import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render, screen, waitFor } from "../../../../test-utils/render";
import Block from "../index";

describe("Faq4", () => {
  it("renders without throwing", () => {
    const { container } = render(<Block />);
    expect(container).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Block />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("moves between category tabs with arrow keys and sets aria-controls", async () => {
    const user = userEvent.setup();
    render(<Block />);

    const tabs = screen.getAllByRole("tab");
    expect(tabs.length).toBeGreaterThan(1);
    expect(screen.getByRole("tablist")).toBeInTheDocument();

    await user.click(tabs[0]);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveFocus();
    await waitFor(() => {
      expect(tabs[0].getAttribute("aria-controls")).toBeTruthy();
    });

    await user.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    });
    expect(tabs[1]).toHaveFocus();
    await waitFor(() => {
      expect(tabs[1].getAttribute("aria-controls")).toBeTruthy();
    });
  });
});
