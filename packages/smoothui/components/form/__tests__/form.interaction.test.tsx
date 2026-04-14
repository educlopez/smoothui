import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import Form, {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "../index";

describe("Form interactions", () => {
  it("calls onFormSubmit when form is submitted", async () => {
    const user = userEvent.setup();
    const onFormSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());

    render(
      <Form onFormSubmit={onFormSubmit}>
        <FormField name="name">
          <FormLabel>Name</FormLabel>
          <FormControl>
            <input type="text" />
          </FormControl>
        </FormField>
        <button type="submit">Submit</button>
      </Form>
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onFormSubmit).toHaveBeenCalledTimes(1);
  });

  it("displays error messages from errors prop", () => {
    render(
      <Form errors={{ email: "Email is required" }}>
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormMessage />
        </FormField>
      </Form>
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Email is required");
  });

  it("displays description text", () => {
    render(
      <Form>
        <FormField name="bio">
          <FormLabel>Bio</FormLabel>
          <FormControl>
            <textarea />
          </FormControl>
          <FormDescription>Tell us about yourself.</FormDescription>
        </FormField>
      </Form>
    );

    expect(screen.getByText("Tell us about yourself.")).toBeInTheDocument();
  });

  it("associates label with input via FormControl", () => {
    render(
      <Form>
        <FormField name="username">
          <FormLabel>Username</FormLabel>
          <FormControl>
            <input type="text" />
          </FormControl>
        </FormField>
      </Form>
    );

    const label = screen.getByText("Username");
    const input = screen.getByRole("textbox");

    // FormControl injects the id on the input, and FormLabel uses htmlFor
    expect(label).toHaveAttribute("for");
    expect(input).toHaveAttribute("id");
    expect(label.getAttribute("for")).toBe(input.getAttribute("id"));
  });

  it("sets aria-invalid on input when there are errors", () => {
    render(
      <Form errors={{ email: "Invalid email" }}>
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormMessage />
        </FormField>
      </Form>
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("does not show error message when no error exists", () => {
    render(
      <Form errors={{}}>
        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input type="email" />
          </FormControl>
          <FormMessage />
        </FormField>
      </Form>
    );

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("allows typing in form inputs", async () => {
    const user = userEvent.setup();

    render(
      <Form>
        <FormField name="name">
          <FormLabel>Name</FormLabel>
          <FormControl>
            <input type="text" />
          </FormControl>
        </FormField>
      </Form>
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello World");
    expect(input).toHaveValue("Hello World");
  });
});
