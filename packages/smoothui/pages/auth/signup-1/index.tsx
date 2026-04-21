"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Checkbox } from "@repo/shadcn-ui/components/ui/checkbox";
import { Input } from "@repo/shadcn-ui/components/ui/input";
import { Label } from "@repo/shadcn-ui/components/ui/label";
import { Apple, Github, Globe, Hexagon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type FormEvent, useState } from "react";

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

const OAUTH_PROVIDERS = [
  { name: "Google", Icon: Globe, label: "Continue with Google" },
  { name: "Apple", Icon: Apple, label: "Continue with Apple" },
  { name: "GitHub", Icon: Github, label: "Continue with GitHub" },
] as const;

const MIN_STRONG_PASSWORD_LENGTH = 10;
const MIN_MEDIUM_PASSWORD_LENGTH = 6;

const getPasswordHint = (password: string) => {
  if (password.length === 0) {
    return {
      label: "Use at least 8 characters with a number or symbol.",
      tone: "muted" as const,
    };
  }
  if (password.length >= MIN_STRONG_PASSWORD_LENGTH) {
    return { label: "Strong password", tone: "strong" as const };
  }
  if (password.length >= MIN_MEDIUM_PASSWORD_LENGTH) {
    return {
      label: "Getting there — add a number or symbol.",
      tone: "medium" as const,
    };
  }
  return { label: "Too short — keep going.", tone: "weak" as const };
};

const TONE_CLASSES: Record<"muted" | "weak" | "medium" | "strong", string> = {
  muted: "text-foreground/50",
  weak: "text-destructive",
  medium: "text-amber-600 dark:text-amber-400",
  strong: "text-emerald-600 dark:text-emerald-400",
};

export function Signup1() {
  const shouldReduceMotion = useReducedMotion();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [password, setPassword] = useState("");

  const initial = shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 };
  const animate = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const stagger = shouldReduceMotion
    ? { duration: 0 }
    : { ...SPRING, staggerChildren: 0.05 };
  const item = shouldReduceMotion ? { duration: 0 } : SPRING;

  const hint = getPasswordHint(password);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section
      aria-labelledby="signup-1-heading"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)/0.08,transparent_70%)]"
      />
      <motion.div
        animate={animate}
        className="relative w-full max-w-sm"
        initial={initial}
        transition={stagger}
      >
        <div className="rounded-xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur">
          <motion.div
            animate={animate}
            className="flex flex-col items-center text-center"
            initial={initial}
            transition={item}
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Hexagon className="size-5" />
            </span>
            <h1
              className="mt-5 font-semibold text-2xl tracking-tight"
              id="signup-1-heading"
            >
              Create your account
            </h1>
            <p className="mt-2 text-foreground/60 text-sm">
              Start building with SmoothUI in seconds
            </p>
          </motion.div>

          <motion.div
            animate={animate}
            className="mt-8 flex flex-col gap-2"
            initial={initial}
            transition={item}
          >
            {OAUTH_PROVIDERS.map(({ name, Icon, label }) => (
              <Button
                className="w-full justify-center gap-2"
                key={name}
                type="button"
                variant="outline"
              >
                <Icon className="size-4" />
                {label}
              </Button>
            ))}
          </motion.div>

          <motion.div
            animate={animate}
            className="my-6 flex items-center gap-3"
            initial={initial}
            transition={item}
          >
            <span className="h-px flex-1 bg-border" />
            <span className="text-foreground/50 text-xs uppercase tracking-wider">
              or
            </span>
            <span className="h-px flex-1 bg-border" />
          </motion.div>

          <motion.form
            animate={animate}
            className="flex flex-col gap-4"
            initial={initial}
            onSubmit={handleSubmit}
            transition={item}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-1-name">Name</Label>
              <Input
                autoComplete="name"
                id="signup-1-name"
                name="name"
                placeholder="Ada Lovelace"
                required
                type="text"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-1-email">Email</Label>
              <Input
                autoComplete="email"
                id="signup-1-email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-1-password">Password</Label>
              <Input
                autoComplete="new-password"
                id="signup-1-password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Choose a secure password"
                required
                type="password"
                value={password}
              />
              <p className={`text-xs ${TONE_CLASSES[hint.tone]}`}>
                {hint.label}
              </p>
            </div>
            <label
              className="flex cursor-pointer items-start gap-2 text-foreground/70 text-sm"
              htmlFor="signup-1-terms"
            >
              <Checkbox
                checked={acceptedTerms}
                className="mt-0.5"
                id="signup-1-terms"
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked === true)
                }
              />
              <span>
                I agree to the{" "}
                <a
                  className="font-medium text-foreground underline underline-offset-4"
                  href="#terms"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  className="font-medium text-foreground underline underline-offset-4"
                  href="#privacy"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            <Button className="w-full" disabled={!acceptedTerms} type="submit">
              Create account
            </Button>
          </motion.form>

          <motion.p
            animate={animate}
            className="mt-6 text-center text-foreground/60 text-sm"
            initial={initial}
            transition={item}
          >
            Already have an account?{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              href="#signin"
            >
              Sign in
            </a>
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

export default Signup1;
