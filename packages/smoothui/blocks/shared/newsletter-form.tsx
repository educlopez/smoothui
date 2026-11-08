"use client";

import Field, { FieldLabel } from "@repo/smoothui/components/field";
import Input from "@repo/smoothui/components/input";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import { cn } from "@repo/smoothui-utils";
import { type FormEvent, useId, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export interface NewsletterFormProps {
  /** Submit button label */
  buttonText: string;
  /** Classes for the `<form>` row */
  className?: string;
  /** Message shown when `onSubscribe` rejects */
  errorMessage?: string;
  /** Classes for the email input */
  inputClassName?: string;
  /**
   * Called with the email on submit. Return a promise to show the submitting
   * state; reject to show the error message. Without it the form only
   * validates and confirms, which is what the docs demo needs: wire it to
   * your provider before shipping.
   */
  onSubscribe?: (email: string) => Promise<void> | void;
  /** Input placeholder */
  placeholder: string;
  /** Message shown after a successful submit */
  successMessage?: string;
}

export const NewsletterForm = ({
  buttonText,
  className,
  errorMessage = "Something went wrong. Try again in a moment.",
  inputClassName,
  onSubscribe,
  placeholder,
  successMessage = "Thanks, you're subscribed.",
}: NewsletterFormProps) => {
  const [status, setStatus] = useState<Status>("idle");
  const messageId = useId();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "").trim();
    if (!email) {
      return;
    }
    setStatus("submitting");
    try {
      await onSubscribe?.(email);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  const messages: Record<Status, string> = {
    error: errorMessage,
    idle: "",
    submitting: "",
    success: successMessage,
  };
  const message = messages[status];
  const buttonLabel = status === "submitting" ? "Subscribing…" : buttonText;

  return (
    <div>
      <form className={cn("flex gap-2", className)} onSubmit={handleSubmit}>
        <Field className="min-w-0 flex-1 gap-0">
          <FieldLabel className="sr-only">Email address</FieldLabel>
          <Input
            aria-describedby={message === "" ? undefined : messageId}
            aria-invalid={status === "error" || undefined}
            autoComplete="email"
            className={inputClassName}
            inputMode="email"
            name="email"
            placeholder={placeholder}
            required
            spellCheck={false}
            type="email"
          />
        </Field>
        <SmoothButton
          disabled={status === "submitting"}
          type="submit"
          variant="candy"
        >
          {buttonLabel}
        </SmoothButton>
      </form>
      <p
        aria-live="polite"
        className={cn(
          "mt-2 min-h-5 text-sm",
          status === "error" ? "text-destructive" : "text-foreground/70"
        )}
        id={messageId}
        role="status"
      >
        {message}
      </p>
    </div>
  );
};
