"use client";

import type {
  AuthFormMode,
  AuthFormStatus,
  AuthFormValues,
} from "@repo/smoothui/components/auth-form";
import AuthForm from "@repo/smoothui/components/auth-form";
import { Chrome, Github } from "lucide-react";
import { useState } from "react";

const SUBMIT_DELAY_MS = 1200;

export default function AuthFormDemo() {
  const [mode, setMode] = useState<AuthFormMode>("sign-in");
  const [status, setStatus] = useState<AuthFormStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  const handleModeChange = (nextMode: AuthFormMode) => {
    setMode(nextMode);
    setStatus("idle");
    setError(undefined);
  };

  const handleSubmit = (values: AuthFormValues) => {
    setStatus("submitting");
    setError(undefined);

    setTimeout(() => {
      if (values.password.length > 0 && values.password.length < 8) {
        setStatus("error");
        setError("That password looks too short. Try again.");
        return;
      }
      setStatus("success");
    }, SUBMIT_DELAY_MS);
  };

  return (
    <div className="mx-auto flex w-full max-w-sm justify-center px-4 py-8">
      <AuthForm
        error={error}
        mode={mode}
        onModeChange={handleModeChange}
        onSubmit={handleSubmit}
        providers={[
          {
            icon: <Chrome className="h-4 w-4" />,
            id: "google",
            label: "Google",
          },
          {
            icon: <Github className="h-4 w-4" />,
            id: "github",
            label: "GitHub",
          },
        ]}
        showMagicLink
        status={status}
      />
    </div>
  );
}
