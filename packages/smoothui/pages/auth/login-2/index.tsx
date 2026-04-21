"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Input } from "@repo/shadcn-ui/components/ui/input";
import { Label } from "@repo/shadcn-ui/components/ui/label";
import {
  Apple,
  Github,
  Globe,
  Hexagon,
  Sparkles,
  Waypoints,
  Zap,
} from "lucide-react";
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

const FEATURE_CARDS = [
  {
    Icon: Sparkles,
    title: "Smooth animations",
    description: "Spring-based motion tuned for every interaction.",
  },
  {
    Icon: Waypoints,
    title: "Composable blocks",
    description: "Drop-in sections for marketing and product pages.",
  },
  {
    Icon: Zap,
    title: "Ship in minutes",
    description: "Copy, paste, customize. No design debt.",
  },
] as const;

export function Login2() {
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 };
  const animate = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const stagger = shouldReduceMotion
    ? { duration: 0 }
    : { ...SPRING, staggerChildren: 0.06 };
  const item = shouldReduceMotion ? { duration: 0 } : SPRING;

  return (
    <section
      aria-labelledby="login-2-heading"
      className="min-h-screen bg-background"
    >
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center px-6 py-16">
          <motion.div
            animate={animate}
            className="w-full max-w-sm"
            initial={initial}
            transition={stagger}
          >
            <motion.div
              animate={animate}
              className="flex items-center gap-2"
              initial={initial}
              transition={item}
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Hexagon className="size-4" />
              </span>
              <span className="font-semibold text-sm tracking-tight">
                SmoothUI
              </span>
            </motion.div>

            <motion.div
              animate={animate}
              className="mt-10"
              initial={initial}
              transition={item}
            >
              <h1
                className="font-semibold text-2xl tracking-tight"
                id="login-2-heading"
              >
                Sign in to your account
              </h1>
              <p className="mt-2 text-foreground/60 text-sm">
                Welcome back. Enter your details to continue.
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
              onSubmit={(event) => event.preventDefault()}
              transition={item}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-2-email">Email</Label>
                <Input
                  autoComplete="email"
                  id="login-2-email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-2-password">Password</Label>
                  <a
                    className="text-foreground/60 text-xs underline-offset-4 hover:text-foreground hover:underline"
                    href="#forgot"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  autoComplete="current-password"
                  id="login-2-password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type="password"
                />
              </div>
              <Button className="w-full" type="submit">
                Sign in
              </Button>
            </motion.form>

            <motion.p
              animate={animate}
              className="mt-6 text-center text-foreground/60 text-sm"
              initial={initial}
              transition={item}
            >
              New to SmoothUI?{" "}
              <a
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                href="#signup"
              >
                Create an account
              </a>
            </motion.p>
          </motion.div>
        </div>

        <aside
          aria-hidden="true"
          className="relative hidden overflow-hidden bg-zinc-950 text-zinc-100 lg:block"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(236,72,153,0.18),transparent_55%)]" />

          <motion.div
            animate={animate}
            className="relative flex h-full flex-col justify-between p-12"
            initial={initial}
            transition={stagger}
          >
            <motion.div
              animate={animate}
              className="max-w-md"
              initial={initial}
              transition={item}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80 text-xs">
                <Sparkles className="size-3" />
                What&apos;s inside
              </span>
              <h2 className="mt-6 text-balance font-semibold text-3xl tracking-tight">
                Build beautiful interfaces without the animation tax.
              </h2>
            </motion.div>

            <div className="my-10 grid gap-3">
              {FEATURE_CARDS.map(({ Icon, title, description }) => (
                <motion.div
                  animate={animate}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                  initial={initial}
                  key={title}
                  transition={item}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-md bg-white/10 text-white">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="font-medium text-sm">{title}</p>
                      <p className="text-white/60 text-xs">{description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.figure
              animate={animate}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              initial={initial}
              transition={item}
            >
              <blockquote className="text-pretty text-sm text-white/90 leading-relaxed">
                &ldquo;SmoothUI shipped our auth UX in a weekend. It just felt
                right from the first keystroke.&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-white/60 text-xs">
                Alex Rivera, Staff Engineer at Meridian
              </figcaption>
            </motion.figure>
          </motion.div>
        </aside>
      </div>
    </section>
  );
}

export default Login2;
