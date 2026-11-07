import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../../test-utils/render";
import { NewsletterForm } from "../newsletter-form";

const setup = (onSubscribe?: (email: string) => Promise<void> | void) => {
  render(
    <NewsletterForm
      buttonText="Subscribe"
      onSubscribe={onSubscribe}
      placeholder="Enter your email"
    />
  );
  return {
    button: screen.getByRole("button", { name: "Subscribe" }),
    input: screen.getByRole("textbox", { name: "Email address" }),
  };
};

describe("NewsletterForm", () => {
  it("is a real email field with autocomplete", () => {
    const { input } = setup();
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("autocomplete", "email");
    expect(input).toBeRequired();
  });

  it("sends the email and announces success", async () => {
    const user = userEvent.setup();
    const onSubscribe = vi.fn();
    const { button, input } = setup(onSubscribe);

    await user.type(input, "ada@example.com");
    await user.click(button);

    expect(onSubscribe).toHaveBeenCalledWith("ada@example.com");
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Thanks, you're subscribed."
    );
  });

  it("announces the error and marks the field invalid when the handler rejects", async () => {
    const user = userEvent.setup();
    const { button, input } = setup(() => Promise.reject(new Error("network")));

    await user.type(input, "ada@example.com");
    await user.click(button);

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Something went wrong"
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});
