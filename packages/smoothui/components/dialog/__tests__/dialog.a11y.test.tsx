import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Dialog, {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
} from "../index";

describe("Dialog a11y", () => {
  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <Dialog description="A test dialog" open title="Test Dialog">
        <p>Dialog content</p>
      </Dialog>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations when closed", async () => {
    const { container } = render(
      <Dialog description="A test dialog" title="Test Dialog">
        <p>Dialog content</p>
      </Dialog>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe("AlertDialog a11y", () => {
  it("has no accessibility violations when open", async () => {
    const { container } = render(
      <AlertDialog
        description="Are you sure?"
        footer={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </>
        }
        open
        title="Confirm Action"
      >
        <p>Alert content</p>
      </AlertDialog>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
