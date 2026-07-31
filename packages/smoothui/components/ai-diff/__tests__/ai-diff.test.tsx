import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import AIDiff, { type AIDiffLine } from "../index";

const LINES: AIDiffLine[] = [
  { number: 1, kind: "context", content: "unchanged" },
  { number: 2, kind: "removed", content: "old line" },
  { number: 2, kind: "added", content: "new line" },
  { number: 3, kind: "added", content: "another new line" },
];

describe("AIDiff", () => {
  it("renders every line with its prefix", () => {
    render(<AIDiff lines={LINES} />);
    expect(screen.getByText("old line")).toBeInTheDocument();
    expect(screen.getByText("new line")).toBeInTheDocument();
  });

  it("derives the summary from the lines", () => {
    render(<AIDiff lines={LINES} />);
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(screen.getByText("-1")).toBeInTheDocument();
  });

  it("offers no controls without handlers", () => {
    render(<AIDiff lines={LINES} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("puts reject before accept, so the safer action comes first", () => {
    render(<AIDiff lines={LINES} onAccept={vi.fn()} onReject={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("Reject");
    expect(buttons[1]).toHaveTextContent("Accept");
  });

  it("reports the decision and retires the controls", () => {
    const onAccept = vi.fn();
    render(<AIDiff lines={LINES} onAccept={onAccept} />);
    fireEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(onAccept).toHaveBeenCalled();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("accepted")).toBeInTheDocument();
  });

  it("renders a title when given one", () => {
    render(<AIDiff lines={LINES} title="src/auth.ts" />);
    expect(screen.getByText("src/auth.ts")).toBeInTheDocument();
  });
});
