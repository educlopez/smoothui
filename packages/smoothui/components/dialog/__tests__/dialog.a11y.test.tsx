import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import { axe } from "vitest-axe";
import Dialog, { AlertDialog, AlertDialogAction, AlertDialogCancel } from "../index";

describe("Dialog a11y", () => {
  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <Dialog open title="Test Dialog" description="A test dialog">
        <p>Dialog content</p>
      </Dialog>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when closed", async () => {
    const { container } = render(
      <Dialog title="Test Dialog" description="A test dialog">
        <p>Dialog content</p>
      </Dialog>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("AlertDialog a11y", () => {
  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <AlertDialog
        open
        title="Confirm Action"
        description="Are you sure?"
        footer={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </>
        }
      >
        <p>Alert content</p>
      </AlertDialog>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
