"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Input } from "@repo/shadcn-ui/components/ui/input";
import { Label } from "@repo/shadcn-ui/components/ui/label";
import { Apple, Github, Globe, Hexagon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

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

export function Login1() {
  const shouldReduceMotion = useReducedMotion();

  const containerInitial = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 24 };
  const containerAnimate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };
  const containerTransition = shouldReduceMotion
    ? { duration: 0 }
    : { ...SPRING, staggerChildren: 0.05 };

  const itemInitial = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 0, y: 8 };
  const itemAnimate = shouldReduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };
  const itemTransition = shouldReduceMotion ? { duration: 0 } : SPRING;

  return (
    <section
      aria-labelledby="login-1-heading"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)/0.08,transparent_70%)]"
      />
      <motion.div
        animate={containerAnimate}
        className="relative w-full max-w-sm"
        initial={containerInitial}
        transition={containerTransition}
      >
        <div className="rounded-xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur">
          <motion.div
            animate={itemAnimate}
            className="flex flex-col items-center text-center"
            initial={itemInitial}
            transition={itemTransition}
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Hexagon className="size-5" />
            </span>
            <h1
              className="mt-5 font-semibold text-2xl tracking-tight"
              id="login-1-heading"
            >
              Welcome back
            </h1>
            <p className="mt-2 text-foreground/60 text-sm">
              Sign in to continue to SmoothUI
            </p>
          </motion.div>

          <motion.div
            animate={itemAnimate}
            className="mt-8 flex flex-col gap-2"
            initial={itemInitial}
            transition={itemTransition}
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
            animate={itemAnimate}
            className="my-6 flex items-center gap-3"
            initial={itemInitial}
            transition={itemTransition}
          >
            <span className="h-px flex-1 bg-border" />
            <span className="text-foreground/50 text-xs uppercase tracking-wider">
              or
            </span>
            <span className="h-px flex-1 bg-border" />
          </motion.div>

          <motion.form
            animate={itemAnimate}
            className="flex flex-col gap-4"
            initial={itemInitial}
            onSubmit={(event) => event.preventDefault()}
            transition={itemTransition}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-1-email">Email</Label>
              <Input
                autoComplete="email"
                id="login-1-email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>
            <Button className="w-full" type="submit">
              Continue with email
            </Button>
          </motion.form>

          <motion.p
            animate={itemAnimate}
            className="mt-6 text-center text-foreground/60 text-sm"
            initial={itemInitial}
            transition={itemTransition}
          >
            Don&apos;t have an account?{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
              href="#signup"
            >
              Sign up
            </a>
          </motion.p>
        </div>

        <motion.p
          animate={itemAnimate}
          className="mt-6 text-balance text-center text-foreground/50 text-xs"
          initial={itemInitial}
          transition={itemTransition}
        >
          By continuing you agree to our{" "}
          <a className="underline underline-offset-4" href="#terms">
            Terms
          </a>{" "}
          and{" "}
          <a className="underline underline-offset-4" href="#privacy">
            Privacy Policy
          </a>
          .
        </motion.p>
      </motion.div>
    </section>
  );
}

export default Login1;
