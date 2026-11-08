import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "../../../test-utils/render";
import ChatTemplate from "../index";

describe("ChatTemplate mobile drawer", () => {
  it("opens as a modal dialog, takes focus, and closes on Escape", async () => {
    const user = userEvent.setup();
    render(<ChatTemplate />);

    const opener = screen.getByRole("button", { name: "Open conversations" });
    await user.click(opener);

    const dialog = await screen.findByRole("dialog", { name: "Conversations" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toContainElement(document.activeElement as HTMLElement);

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Conversations" })
      ).not.toBeInTheDocument();
    });
    expect(opener).toHaveFocus();
  });
});
