"use client";

import Field, {
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/smoothui/components/field";

export default function FieldDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 p-8">
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <FieldControl placeholder="you@example.com" type="email" />
        <FieldDescription>
          We will never share your email with anyone.
        </FieldDescription>
      </Field>

      <Field invalid name="username">
        <FieldLabel>Username</FieldLabel>
        <FieldControl defaultValue="ab" required />
        <FieldDescription>At least 3 characters.</FieldDescription>
        <FieldError match>Username must be at least 3 characters.</FieldError>
      </Field>
    </div>
  );
}
