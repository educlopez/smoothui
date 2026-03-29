import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import userEvent from "@testing-library/user-event";
import Dialog, { AlertDialog, AlertDialogAction, AlertDialogCancel } from "../index";

describe("Dialog interactions", () => {
  it("renders trigger and opens on click", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog
        title="Test Dialog"
        description="Description"
        trigger={<button type="button">Open</button>}
        onOpenChange={onOpenChange}
      >
        <p>Content</p>
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Dialog open title="Test" onOpenChange={onOpenChange}>
        <p>Content</p>
      </Dialog>,
    );

    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("renders title and description", () => {
    render(
      <Dialog open title="My Title" description="My Description">
        <p>Body</p>
      </Dialog>,
    );

    expect(screen.getByText("My Title")).toBeInTheDocument();
    expect(screen.getByText("My Description")).toBeInTheDocument();
  });

  it("renders footer content", () => {
    render(
      <Dialog open title="Test" footer={<button type="button">Save</button>}>
        <p>Content</p>
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});

describe("AlertDialog interactions", () => {
  it("renders action and cancel buttons", () => {
    render(
      <AlertDialog
        open
        title="Confirm"
        description="Are you sure?"
        footer={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </>
        }
      />,
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
  });

  it("calls onOpenChange when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <AlertDialog
        open
        title="Confirm"
        onOpenChange={onOpenChange}
        footer={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>OK</AlertDialogAction>
          </>
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onOpenChange).toHaveBeenCalled();
  });
});
