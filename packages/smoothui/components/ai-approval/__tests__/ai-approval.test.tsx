import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import AIApproval, { type AIApprovalOption } from "../index";

const OPTIONS: AIApprovalOption[] = [
  { id: "keep", label: "Keep the draft" },
  { id: "delete", label: "Delete everything", destructive: true },
];

describe("AIApproval", () => {
  it("renders the question and every option", () => {
    render(<AIApproval options={OPTIONS} question="Proceed?" />);
    expect(screen.getByText("Proceed?")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("replaces the options with the choice, so the decision looks decided", async () => {
    render(<AIApproval options={OPTIONS} question="Proceed?" />);
    fireEvent.click(screen.getByRole("button", { name: /Keep the draft/ }));

    // The options exit-animate out, so they linger for a frame or two.
    await waitFor(() => expect(screen.queryByRole("button")).toBeNull());
    expect(screen.getByText("Keep the draft")).toBeInTheDocument();
    expect(screen.queryByText("Delete everything")).toBeNull();
  });

  it("reports the chosen option once", () => {
    const onDecide = vi.fn();
    render(
      <AIApproval onDecide={onDecide} options={OPTIONS} question="Proceed?" />
    );
    fireEvent.click(screen.getByRole("button", { name: /Delete everything/ }));
    expect(onDecide).toHaveBeenCalledTimes(1);
    expect(onDecide).toHaveBeenCalledWith(OPTIONS[1]);
  });

  it("can render already resolved, for replaying a transcript", () => {
    render(
      <AIApproval options={OPTIONS} question="Proceed?" resolvedId="delete" />
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Delete everything")).toBeInTheDocument();
  });

  it("renders extra context when given", () => {
    render(
      <AIApproval options={OPTIONS} question="Proceed?">
        This cannot be undone.
      </AIApproval>
    );
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });
});
