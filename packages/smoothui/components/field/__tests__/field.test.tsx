import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Field, {
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../index";

describe("Field", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl placeholder="you@example.com" type="email" />
        <FieldDescription>We will never share your email.</FieldDescription>
      </Field>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders label, control, and error when invalid", () => {
    const { getByText, getByPlaceholderText } = render(
      <Field invalid name="username">
        <FieldLabel>Username</FieldLabel>
        <FieldControl placeholder="handle" required />
        <FieldError match>Username must be at least 3 characters.</FieldError>
      </Field>
    );

    expect(getByText("Username")).toBeInTheDocument();
    expect(getByPlaceholderText("handle")).toBeInTheDocument();
    expect(
      getByText("Username must be at least 3 characters.")
    ).toBeInTheDocument();
  });
});
