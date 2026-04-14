"use client";

import Checkbox from "@repo/smoothui/components/checkbox";
import Form, {
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from "@repo/smoothui/components/form";
import Select from "@repo/smoothui/components/select";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import type React from "react";
import { useState } from "react";

const subjectOptions = [
  { value: "general", label: "General inquiry" },
  { value: "support", label: "Technical support" },
  { value: "sales", label: "Sales" },
  { value: "feedback", label: "Feedback" },
];

type FormData = {
  name: string;
  email: string;
  subject: string;
  acceptTerms: boolean;
};

type FormErrors = Record<string, string | undefined>;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) {
    errors.name = "Name is required.";
  }
  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!data.subject) {
    errors.subject = "Please select a subject.";
  }
  if (!data.acceptTerms) {
    errors.acceptTerms = "You must accept the terms.";
  }
  return errors;
}

export default function FormDemo() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (!hasErrors) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex w-full max-w-md flex-col items-center gap-2 p-8 text-center">
        <p className="font-medium text-lg">Form submitted successfully!</p>
        <p className="text-muted-foreground text-sm">
          Thank you, {formData.name}.
        </p>
        <SmoothButton
          className="mt-2"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              name: "",
              email: "",
              subject: "",
              acceptTerms: false,
            });
            setErrors({});
          }}
          type="button"
          variant="link"
        >
          Reset form
        </SmoothButton>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8">
      <Form errors={errors} onFormSubmit={handleSubmit}>
        <FormField name="name">
          <FormLabel>Name</FormLabel>
          <FormControl>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Your name"
              type="text"
              value={formData.name}
            />
          </FormControl>
          <FormMessage />
        </FormField>

        <FormField name="email">
          <FormLabel>Email</FormLabel>
          <FormControl>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="you@example.com"
              type="email"
              value={formData.email}
            />
          </FormControl>
          <FormDescription>We will never share your email.</FormDescription>
          <FormMessage />
        </FormField>

        <FormField name="subject">
          <FormLabel>Subject</FormLabel>
          <FormControl>
            <Select
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, subject: val }))
              }
              options={subjectOptions}
              placeholder="Select a subject"
              value={formData.subject}
            />
          </FormControl>
          <FormMessage />
        </FormField>

        <FormField name="acceptTerms">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={formData.acceptTerms}
              id="accept-terms"
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, acceptTerms: checked }))
              }
            />
            <label
              className="font-medium text-sm leading-none"
              htmlFor="accept-terms"
            >
              I accept the terms and conditions
            </label>
          </div>
          <FormMessage />
        </FormField>

        <SmoothButton type="submit" variant="candy">
          Submit
        </SmoothButton>
      </Form>
    </div>
  );
}
