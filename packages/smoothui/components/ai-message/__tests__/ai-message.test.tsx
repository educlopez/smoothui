import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { render } from "../../../test-utils/render";
import AIMessage from "../index";

describe("AIMessage", () => {
  it("renders its content and timestamp", () => {
    render(<AIMessage timestamp="14:32">Hello</AIMessage>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("14:32")).toBeInTheDocument();
  });

  it("keeps actions mounted so the row never changes height", () => {
    // Mounting them on hover shifted every message below. They are always in the
    // DOM now and only faded by CSS, which also keeps them reachable by keyboard.
    render(<AIMessage copyText="x">Hello</AIMessage>);
    expect(screen.getByRole("button", { name: "Copy" })).toHaveClass(
      "ai-message-action"
    );
  });

  it("scopes the reveal to its own root, not to a shared `group` class", () => {
    // A `group` ancestor elsewhere on the page would otherwise reveal the actions
    // of every message at once.
    const { container } = render(<AIMessage copyText="x">Hello</AIMessage>);
    expect(container.firstChild).toHaveClass("ai-message-root");
  });

  it("puts the timestamp before the actions, pinned to the bubble's edge", () => {
    render(
      <AIMessage copyText="x" timestamp="14:32">
        Hello
      </AIMessage>
    );
    const meta = screen.getByText("14:32").parentElement as HTMLElement;
    // Invisible action slots ahead of it pushed the timestamp into the middle of
    // the row, where it read as floating in nothing.
    expect(meta.firstElementChild).toHaveTextContent("14:32");
  });

  it("only offers the actions it was given handlers for", () => {
    render(<AIMessage onRetry={vi.fn()}>Hello</AIMessage>);
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Good response" })).toBeNull();
  });

  it("drops the tinted bubble when asked, for turns that carry their own cards", () => {
    const { container } = render(<AIMessage bubble={false}>Hello</AIMessage>);
    const body = screen.getByText("Hello");
    expect(body.className).not.toContain("bg-muted");
    // The row itself is untouched — only the bubble skin goes away.
    expect(container.firstChild).toHaveClass("ai-message-root");
  });

  it("never offers voting on a user message", () => {
    // You do not rate your own message.
    render(
      <AIMessage from="user" onVote={vi.fn()}>
        Hello
      </AIMessage>
    );
    expect(screen.queryByRole("button", { name: "Good response" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Bad response" })).toBeNull();
  });

  it("reports a vote and marks the button pressed", () => {
    const onVote = vi.fn();
    render(<AIMessage onVote={onVote}>Hello</AIMessage>);
    fireEvent.click(screen.getByRole("button", { name: "Good response" }));
    expect(onVote).toHaveBeenCalledWith("up");
    expect(
      screen.getByRole("button", { name: "Good response" })
    ).toHaveAttribute("aria-pressed", "true");
  });
});
