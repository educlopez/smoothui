"use client";

import { Canva, Descript, Duolingo, Faire, Ramp } from "@repo/blocks-shared";
import { Input } from "@repo/shadcn-ui/components/ui/input";
import { Label } from "@repo/shadcn-ui/components/ui/label";
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
  { name: "Google", Icon: Globe, label: "Google" },
  { name: "Apple", Icon: Apple, label: "Apple" },
  { name: "GitHub", Icon: Github, label: "GitHub" },
] as const;

const CREATIVE_LOGOS = [
  { name: "Canva", Logo: Canva },
  { name: "Duolingo", Logo: Duolingo },
  { name: "Ramp", Logo: Ramp },
  { name: "Faire", Logo: Faire },
  { name: "Descript", Logo: Descript },
] as const;

export function Login3() {
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 };
  const animate = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const stagger = shouldReduceMotion
    ? { duration: 0 }
    : { ...SPRING, staggerChildren: 0.06 };
  const item = shouldReduceMotion ? { duration: 0 } : SPRING;

  return (
    <section
      aria-labelledby="login-3-heading"
      className="min-h-screen bg-background"
    >
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Form column — compact, card-less */}
        <div className="flex items-center justify-center px-6 py-16 lg:px-12">
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
              <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-brand to-brand-secondary text-white">
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
                className="text-balance font-semibold text-4xl leading-[1.05] tracking-tight"
                id="login-3-heading"
              >
                Welcome back{" "}
                <span aria-hidden="true" className="inline-block">
                  👋
                </span>
              </h1>
              <p className="mt-3 text-foreground/60 text-sm">
                Sign in and keep creating.
              </p>
            </motion.div>

            <motion.div
              animate={animate}
              className="mt-8 grid grid-cols-3 gap-2"
              initial={initial}
              transition={item}
            >
              {OAUTH_PROVIDERS.map(({ name, Icon, label }) => (
                <SmoothButton
                  aria-label={`Continue with ${label}`}
                  className="w-full justify-center gap-2"
                  key={name}
                  type="button"
                  variant="outline"
                >
                  <Icon className="size-4" />
                  <span className="text-xs">{label}</span>
                </SmoothButton>
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
                or with email
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
                <Label htmlFor="login-3-email">Email</Label>
                <Input
                  autoComplete="email"
                  id="login-3-email"
                  name="email"
                  placeholder="you@studio.com"
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
                Sign in with email
              </SmoothButton>
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
                Sign up
              </a>
            </motion.p>
          </motion.div>
        </div>

        {/* Pastel creative hero column */}
        <aside className="relative hidden overflow-hidden bg-gradient-to-br from-violet-200 via-pink-100 to-amber-100 lg:block dark:from-violet-950 dark:via-pink-950 dark:to-amber-950">
          {/* Ambient iridescent orb */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div className="opacity-80 blur-sm">
              <SiriOrb animationDuration={22} size="520px" />
            </div>
          </div>

          {/* Subtle conic-gradient overlay for iridescent sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, #f472b6 0deg, #a78bfa 90deg, #fbbf24 180deg, #34d399 270deg, #f472b6 360deg)",
            }}
          />

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
              <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-3 py-1 font-medium text-foreground/80 text-xs backdrop-blur-md dark:border-white/10 dark:bg-white/10 dark:text-white/80">
                For creative teams
              </span>
            </motion.div>

            <motion.div
              animate={animate}
              className="max-w-md"
              initial={initial}
              transition={item}
            >
              <h2 className="text-balance font-semibold text-4xl text-foreground/90 leading-[1.05] tracking-tight dark:text-white/90">
                Animations that feel handcrafted.
              </h2>
              <p className="mt-4 text-foreground/70 text-sm dark:text-white/70">
                Every component tuned with spring physics and reduced-motion
                care — so your product feels alive without the jank.
              </p>
            </motion.div>

            <motion.div
              animate={animate}
              className="max-w-md"
              initial={initial}
              transition={item}
            >
              <p className="text-foreground/60 text-xs uppercase tracking-wider dark:text-white/60">
                Trusted by creative teams at
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 text-foreground/70 opacity-70 grayscale dark:text-white/70">
                {CREATIVE_LOGOS.map(({ name, Logo }) => (
                  <span
                    aria-label={name}
                    className="inline-flex h-5 items-center [&_svg]:h-5 [&_svg]:w-auto"
                    key={name}
                  >
                    <Logo />
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </aside>
      </div>
    </section>
  );
}

export default Login3;
