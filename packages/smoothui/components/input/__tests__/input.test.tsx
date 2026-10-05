import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { render, screen } from "../../../test-utils/render";
import Field, { FieldError, FieldLabel } from "../../field";
import Input from "../index";

describe("Input", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Input aria-label="Email" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders a text input by default and honors type", () => {
    const { rerender } = render(<Input aria-label="Name" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    rerender(<Input aria-label="Password" type="password" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("matches FieldControl sizing and focus styles", () => {
    render(<Input aria-label="Name" />);
    const el = screen.getByRole("textbox");
    expect(el.className).toContain("h-9");
    expect(el.className).toContain("border-foreground/25");
    expect(el.className).toContain("focus-visible:ring-[3px]");
  });

  it("reports typed values", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Input aria-label="Name" onValueChange={onValueChange} />);
    await user.type(screen.getByRole("textbox"), "hi");
    expect(onValueChange).toHaveBeenLastCalledWith("hi", expect.anything());
  });

  it("does not accept input when disabled", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" disabled />);
    const el = screen.getByRole("textbox");
    expect(el).toBeDisabled();
    await user.type(el, "x");
    expect(el).toHaveValue("");
  });

  it("forwards aria-invalid", () => {
    render(<Input aria-invalid aria-label="Name" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("works inside Field with an associated label", async () => {
    const { container } = render(
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input placeholder="you@example.com" />
        <FieldError match>Required</FieldError>
      </Field>
    );
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
