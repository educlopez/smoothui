import { describe, expect, it } from "vitest";
import { render } from "../../../test-utils/render";
import Form, { FormField, FormLabel, FormControl, FormMessage } from "../index";

describe("Form", () => {
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
