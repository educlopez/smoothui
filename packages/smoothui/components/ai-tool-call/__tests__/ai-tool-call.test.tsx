import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AIToolCall, { type AIToolCallStatus } from "../index";

describe("AIToolCall", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <AIToolCall
        args={<span>args</span>}
        name="search_web"
        result={<span>res</span>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("shows the tool name", () => {
    render(<AIToolCall name="search_web" />);
    expect(screen.getByText("search_web")).toBeInTheDocument();
  });

  it("exposes the status as text, since colour and motion carry it visually", () => {
    const labels: Record<AIToolCallStatus, string> = {
      error: "Failed",
      pending: "Queued",
      running: "Running",
      success: "Done",
    };
    for (const [status, label] of Object.entries(labels)) {
      const { container } = render(
        <AIToolCall name="t" status={status as AIToolCallStatus} />
      );
      expect(container.textContent).toContain(label);
    }
  });

  it("keeps one ring across every status instead of swapping icons", () => {
    for (const status of ["pending", "running", "success", "error"] as const) {
      const { container } = render(<AIToolCall name="t" status={status} />);
      expect(container.querySelectorAll("circle")).toHaveLength(1);
    }
  });

  it("is not expandable without args or result", () => {
    render(<AIToolCall name="t" />);
    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
    expect(trigger).not.toHaveAttribute("aria-expanded");
  });

  it("expands to reveal arguments and result", () => {
    render(
      <AIToolCall args={<span>args</span>} name="t" result={<span>res</span>} />
    );
    const trigger = screen.getByRole("button");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("args")).toBeInTheDocument();
    expect(screen.getByText("res")).toBeInTheDocument();
  });
});
