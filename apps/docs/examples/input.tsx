"use client";

import Field, {
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/smoothui/components/field";
import Input from "@repo/smoothui/components/input";

const FeaturesDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-4 p-8">
    <Input aria-label="Search" placeholder="Search components…" type="search" />
    <Input aria-label="Disabled" disabled placeholder="Disabled" />
    <Input aria-invalid aria-label="Invalid" defaultValue="not-an-email" />
  </div>
);

const InFieldDemo = () => (
  <div className="flex w-full max-w-sm flex-col gap-6 p-8">
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="you@example.com" type="email" />
      <FieldDescription>We will never share your email.</FieldDescription>
    </Field>
    <Field invalid name="username">
      <FieldLabel>Username</FieldLabel>
      <Input defaultValue="ab" required />
      <FieldError match>Username must be at least 3 characters.</FieldError>
    </Field>
  </div>
);

export const demoScenes = {
  Features: FeaturesDemo,
  "In Field": InFieldDemo,
};

export default function InputDemo() {
  return <FeaturesDemo />;
}
