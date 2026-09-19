import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { render } from "../../../test-utils/render";
import Form, { FormControl, FormField, FormLabel, FormMessage } from "../index";

describe("Form", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Form>
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormMessage />
        </FormField>
      </Form>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("renders without throwing", () => {
    const { container } = render(
      <Form>
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormMessage />
        </FormField>
      </Form>
    );
    expect(container).toBeInTheDocument();
  });
});
