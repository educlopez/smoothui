import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Dialog, {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
} from "../index";

describe("Dialog interactions", () => {
  it("renders trigger and opens on click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog
        description="Description"
        onOpenChange={onOpenChange}
        title="Test Dialog"
        trigger={<button type="button">Open</button>}
      >
        <p>Content</p>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog onOpenChange={onOpenChange} open title="Test">
        <p>Content</p>
      </Dialog>
    );

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders title and description", () => {
    render(
      <Dialog description="My Description" open title="My Title">
        <p>Body</p>
      </Dialog>
    );

    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My Description")).toBeInTheDocument();
  });

  it("renders footer content", () => {
    render(
      <Dialog footer={<button type="button">Save</button>} open title="Test">
        <p>Content</p>
      </Dialog>
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});

describe("AlertDialog interactions", () => {
  it("renders action and cancel buttons", () => {
    render(
      <AlertDialog
        description="Are you sure?"
        footer={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </>
        }
        open
        title="Confirm"
      />
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" })
    ).toBeInTheDocument();
  });

  it("calls onOpenChange when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <AlertDialog
        footer={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </>
        }
        onOpenChange={onOpenChange}
        open
        title="Confirm"
      />
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalled();
  });
});
