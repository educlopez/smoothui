"use client";

import { Input } from "@repo/shadcn-ui/components/ui/input";
import { Label } from "@repo/shadcn-ui/components/ui/label";
import ScrambleHover from "@repo/smoothui/components/scramble-hover";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import SmoothButton from "@repo/smoothui/components/smooth-button";
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
      {/* Ambient orb hero — sits behind the card for atmospheric glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-60 blur-2xl dark:opacity-40"
      >
        <SiriOrb animationDuration={30} size="640px" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background"
      />

      <motion.div
        animate={containerAnimate}
        className="relative w-full max-w-sm"
        initial={containerInitial}
        transition={containerTransition}
      >
        {/* Wordmark */}
        <motion.div
          animate={itemAnimate}
          className="mb-6 flex items-center justify-center gap-2"
          initial={itemInitial}
          transition={itemTransition}
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-brand to-brand-secondary text-white shadow-sm">
            <Hexagon className="size-4" />
          </span>
          <span className="font-semibold text-sm tracking-tight">SmoothUI</span>
        </motion.div>

        <div className="rounded-2xl border border-border/60 bg-background/80 p-8 shadow-black/5 shadow-xl backdrop-blur-xl">
          <motion.div
            animate={itemAnimate}
            className="flex flex-col items-center text-center"
            initial={itemInitial}
            transition={itemTransition}
          >
            <h1
              className="font-semibold text-2xl tracking-tight"
              id="login-1-heading"
            >
              Welcome back to{" "}
              <ScrambleHover className="font-semibold">SmoothUI</ScrambleHover>
            </h1>
            <p className="mt-2 text-foreground/60 text-sm">
              Sign in to continue building beautiful interfaces
            </p>
          </motion.div>

          <motion.div
            animate={itemAnimate}
            className="mt-8 flex flex-col gap-2"
            initial={itemInitial}
            transition={itemTransition}
          >
            {OAUTH_PROVIDERS.map(({ name, Icon, label }) => (
              <SmoothButton
                className="w-full justify-center gap-2"
                key={name}
                type="button"
                variant="outline"
              >
                <Icon className="size-4" />
                {label}
              </SmoothButton>
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
            <SmoothButton
              className="w-full"
              size="lg"
              type="submit"
              variant="candy"
            >
              Continue with email
            </SmoothButton>
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
