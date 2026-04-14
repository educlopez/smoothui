import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Form, {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "../index";

describe("Form a11y", () => {
  it("has no accessibility violations with fields", async () => {
    const { container } = render(
      <Form>
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input placeholder="you@example.com" type="email" />
          </FormControl>
          <FormDescription>We will never share your email.</FormDescription>
          <FormMessage />
        </FormField>
      </Form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no accessibility violations with error messages", async () => {
    const { container } = render(
      <Form errors={{ email: "Email is required" }}>
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input placeholder="you@example.com" type="email" />
          </FormControl>
          <FormMessage />
        </FormField>
      </Form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
