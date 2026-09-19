import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import AIPromptInput from "../index";

describe("AIPromptInput", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<AIPromptInput placeholder="Ask anything…" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders the placeholder", () => {
    render(<AIPromptInput placeholder="Ask anything…" />);
    expect(screen.getByPlaceholderText("Ask anything…")).toBeInTheDocument();
  });

  it("disables submit until the draft has content", () => {
    render(<AIPromptInput />);
    const submit = screen.getByRole("button", { name: "Send message" });
    expect(submit).toBeDisabled();

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "hello" },
    });
    expect(submit).not.toBeDisabled();
  });

  it("submits on Enter and clears the draft", () => {
    const onSubmit = vi.fn();
    render(<AIPromptInput onSubmit={onSubmit} />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "  hello  " } });
    fireEvent.keyDown(textarea, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledWith("hello");
    expect(textarea).toHaveValue("");
  });

  it("does not submit on Shift+Enter", () => {
    const onSubmit = vi.fn();
    render(<AIPromptInput onSubmit={onSubmit} />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "hello" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("turns submit into stop while streaming", () => {
    const onStop = vi.fn();
    render(<AIPromptInput onStop={onStop} state="streaming" />);

    const stop = screen.getByRole("button", { name: "Stop generating" });
    expect(stop).not.toBeDisabled();

    fireEvent.click(stop);
    expect(onStop).toHaveBeenCalled();
  });

  it("shows the counter only past 80% of maxLength", () => {
    render(<AIPromptInput maxLength={10} />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "abc" } });
    expect(screen.queryByText("3/10")).toBeNull();

    fireEvent.change(textarea, { target: { value: "abcdefgh" } });
    expect(screen.getByText("8/10")).toBeInTheDocument();
  });

  it("renders attachments with a labelled remove control", () => {
    const onRemoveAttachment = vi.fn();
    render(
      <AIPromptInput
        attachments={[{ id: "a", name: "notes.pdf", size: 2048 }]}
        onRemoveAttachment={onRemoveAttachment}
      />
    );

    expect(screen.getByText("notes.pdf")).toBeInTheDocument();
    expect(screen.getByText("2 KB")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remove notes.pdf" }));
    expect(onRemoveAttachment).toHaveBeenCalledWith("a");
  });

  it("respects a controlled value", () => {
    const onValueChange = vi.fn();
    render(<AIPromptInput onValueChange={onValueChange} value="fixed" />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "typed" } });

    expect(onValueChange).toHaveBeenCalledWith("typed");
    expect(textarea).toHaveValue("fixed");
  });
});
