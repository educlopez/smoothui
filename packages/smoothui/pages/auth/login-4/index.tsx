"use client";

import { Checkbox } from "@repo/shadcn-ui/components/ui/checkbox";
import { Input } from "@repo/shadcn-ui/components/ui/input";
import { Label } from "@repo/shadcn-ui/components/ui/label";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import WaveText from "@repo/smoothui/components/wave-text";
import { Apple, Github, Globe, Hexagon, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type FormEvent, useState } from "react";

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

const OAUTH_PROVIDERS = [
  { name: "Google", Icon: Globe },
  { name: "Apple", Icon: Apple },
  { name: "GitHub", Icon: Github },
] as const;

export function Login4() {
  const shouldReduceMotion = useReducedMotion();
  const [rememberMe, setRememberMe] = useState(false);

  const initial = shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 };
  const animate = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const stagger = shouldReduceMotion
    ? { duration: 0 }
    : { ...SPRING, staggerChildren: 0.06 };
  const item = shouldReduceMotion ? { duration: 0 } : SPRING;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section
      aria-labelledby="login-4-heading"
      className="min-h-screen bg-background"
    >
      <div className="grid min-h-screen lg:grid-cols-[45%_55%]">
        {/* Editorial brand column */}
        <aside className="relative hidden overflow-hidden bg-emerald-950 text-white lg:block">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.25),transparent_60%)]"
          />
          <motion.div
            animate={animate}
            className="relative flex h-full flex-col justify-between p-12"
            initial={initial}
            transition={stagger}
          >
            <motion.div
              animate={animate}
              className="flex items-center gap-2"
              initial={initial}
              transition={item}
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-white/10 text-white">
                <Hexagon className="size-4" />
              </span>
              <span className="font-semibold text-sm tracking-tight">
                SmoothUI
              </span>
            </motion.div>

            <motion.div
              animate={animate}
              className="max-w-xl"
              initial={initial}
              transition={item}
            >
              <h2 className="text-balance font-semibold text-6xl uppercase leading-[0.95] tracking-tight md:text-7xl">
                <WaveText amplitude={4} staggerDelay={0.04}>
                  Build UI
                </WaveText>
                <br />
                <span>that moves.</span>
              </h2>
              <p className="mt-6 max-w-sm text-pretty text-sm text-white/70 leading-relaxed">
                Animated components. Typed. Tested. Yours.
              </p>
            </motion.div>

            <motion.div
              animate={animate}
              className="flex items-center gap-6"
              initial={initial}
              transition={item}
            >
              <a
                className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline"
                href="#docs"
              >
                Read docs →
              </a>
              <a
                className="text-sm text-white/70 underline-offset-4 hover:text-white hover:underline"
                href="#get-kit"
              >
                Get the kit →
              </a>
            </motion.div>
          </motion.div>
        </aside>

        {/* Form column */}
        <div className="relative flex items-center justify-center bg-background px-6 py-16">
          <button
            aria-label="Close"
            className="absolute top-6 right-6 inline-flex size-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-accent hover:text-foreground"
            type="button"
          >
            <X className="size-4" />
          </button>

          <motion.div
            animate={animate}
            className="w-full max-w-sm"
            initial={initial}
            transition={stagger}
          >
            <motion.div
              animate={animate}
              className="flex items-center gap-2 lg:hidden"
              initial={initial}
              transition={item}
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-brand to-brand-secondary text-white">
                <Hexagon className="size-4" />
              </span>
              <span className="font-semibold text-sm tracking-tight">
                SmoothUI
              </span>
            </motion.div>

            <motion.div
              animate={animate}
              className="mt-8 lg:mt-0"
              initial={initial}
              transition={item}
            >
              <h1
                className="font-semibold text-3xl tracking-tight"
                id="login-4-heading"
              >
                Welcome back.
              </h1>
              <p className="mt-2 text-foreground/60 text-sm">
                New to SmoothUI?{" "}
                <a
                  className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                  href="#signup"
                >
                  Sign up
                </a>
              </p>
            </motion.div>

            <motion.form
              animate={animate}
              className="mt-8 flex flex-col gap-4"
              initial={initial}
              onSubmit={handleSubmit}
              transition={item}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-4-email">Email</Label>
                <Input
                  autoComplete="email"
                  id="login-4-email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-4-password">Password</Label>
                  <a
                    className="text-foreground/60 text-xs underline-offset-4 hover:text-foreground hover:underline"
                    href="#forgot"
                  >
                    Trouble logging in?
                  </a>
                </div>
                <Input
                  autoComplete="current-password"
                  id="login-4-password"
                  name="password"
                  placeholder="Enter your password"
                  required
                  type="password"
                />
              </div>

              <label
                className="flex cursor-pointer items-center gap-2 text-foreground/70 text-sm"
                htmlFor="login-4-remember"
              >
                <Checkbox
                  checked={rememberMe}
                  id="login-4-remember"
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <span>Remember me for 30 days</span>
              </label>

              <SmoothButton
                className="w-full"
                size="lg"
                type="submit"
                variant="candy"
              >
                Log in
              </SmoothButton>
            </motion.form>

            <motion.div
              animate={animate}
              className="my-6 flex items-center gap-3"
              initial={initial}
              transition={item}
            >
              <span className="h-px flex-1 bg-border" />
              <span className="text-foreground/50 text-xs uppercase tracking-wider">
                Or log in with
              </span>
              <span className="h-px flex-1 bg-border" />
            </motion.div>

            <motion.div
              animate={animate}
              className="flex items-center justify-center gap-3"
              initial={initial}
              transition={item}
            >
              {OAUTH_PROVIDERS.map(({ name, Icon }) => (
                <button
                  aria-label={`Log in with ${name}`}
                  className="inline-flex size-12 items-center justify-center rounded-full border border-input bg-background text-foreground/70 shadow-xs transition-colors hover:bg-accent hover:text-foreground"
                  key={name}
                  type="button"
                >
                  <Icon className="size-5" />
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Login4;
