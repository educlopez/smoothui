import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "../../../test-utils/render";
import Toaster, { toast } from "../index";

describe("Toast interactions", () => {
  it("dismisses a toast with the close button", async () => {
    const user = userEvent.setup();
    render(<Toaster />);
    act(() => {
      toast({ timeout: 0, title: "Dismiss me" });
    });

    expect(await screen.findByText("Dismiss me")).toBeInTheDocument();
    // Base UI marks Close aria-hidden while the stack is collapsed.
    const close = document.querySelector("[data-slot='toast-close']");
    expect(close).not.toBeNull();
    await user.click(close as HTMLElement);
    await waitFor(() => expect(screen.queryByText("Dismiss me")).toBeNull());
  });

  it("runs the action handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Toaster />);
    act(() => {
      toast({
        actionProps: { children: "Undo", onClick },
        timeout: 0,
        title: "Deleted",
      });
    });

    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalled();
  });

  it("auto-dismisses after the timeout", async () => {
    render(<Toaster />);
    act(() => {
      toast({ timeout: 50, title: "Fleeting" });
    });
    expect(await screen.findByText("Fleeting")).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText("Fleeting")).toBeNull(), {
      timeout: 2000,
    });
  });
});
