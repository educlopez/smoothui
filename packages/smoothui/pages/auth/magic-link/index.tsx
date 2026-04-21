"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { Input } from "@repo/shadcn-ui/components/ui/input";
import { Label } from "@repo/shadcn-ui/components/ui/label";
import { ArrowLeft, Hexagon, Mail, MailCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type FormEvent, useState } from "react";

const SPRING = {
  type: "spring" as const,
  duration: 0.25,
  bounce: 0.1,
};

type ViewState = "input" | "sent";

export function MagicLink() {
  const shouldReduceMotion = useReducedMotion();
  const [view, setView] = useState<ViewState>("input");
  const [email, setEmail] = useState("");

  const initial = shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 };
  const animate = shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 };
  const exit = shouldReduceMotion
    ? { opacity: 0, transition: { duration: 0 } }
    : { opacity: 0, y: -16 };
  const stagger = shouldReduceMotion
    ? { duration: 0 }
    : { ...SPRING, staggerChildren: 0.05 };
  const item = shouldReduceMotion ? { duration: 0 } : SPRING;

  const iconInitial = shouldReduceMotion
    ? { opacity: 1, scale: 1 }
    : { opacity: 0, scale: 0.85 };
  const iconAnimate = shouldReduceMotion
    ? { opacity: 1, scale: 1 }
    : { opacity: 1, scale: 1 };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setView("sent");
  };

  const handleUseDifferentEmail = () => {
    setView("input");
  };

  return (
    <section
      aria-labelledby="magic-link-heading"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)/0.08,transparent_70%)]"
      />

      <div className="relative w-full max-w-sm">
        <div className="rounded-xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur">
          <AnimatePresence initial={false} mode="wait">
            {view === "input" ? (
              <motion.div
                animate={animate}
                exit={exit}
                initial={initial}
                key="input"
                transition={stagger}
              >
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
                    id="magic-link-heading"
                  >
                    Sign in with magic link
                  </h1>
                  <p className="mt-2 text-balance text-foreground/60 text-sm">
                    Enter your email and we&apos;ll send you a secure link.
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
                    <Label htmlFor="magic-link-email">Email</Label>
                    <Input
                      autoComplete="email"
                      id="magic-link-email"
                      name="email"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required
                      type="email"
                      value={email}
                    />
                  </div>
                  <Button className="w-full gap-2" type="submit">
                    <Mail className="size-4" />
                    Send magic link
                  </Button>
                </motion.form>

                <motion.p
                  animate={animate}
                  className="mt-6 text-center text-foreground/60 text-sm"
                  initial={initial}
                  transition={item}
                >
                  Prefer password?{" "}
                  <a
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                    href="#signin"
                  >
                    Sign in
                  </a>
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                animate={animate}
                exit={exit}
                initial={initial}
                key="sent"
                transition={stagger}
              >
                <motion.div
                  animate={animate}
                  className="flex flex-col items-center text-center"
                  initial={initial}
                  transition={item}
                >
                  <motion.span
                    animate={iconAnimate}
                    className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
                    initial={iconInitial}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { ...SPRING, bounce: 0.1, duration: 0.3 }
                    }
                  >
                    <MailCheck className="size-6" />
                  </motion.span>
                  <h2 className="mt-5 font-semibold text-2xl tracking-tight">
                    Check your email
                  </h2>
                  <p className="mt-2 text-balance text-foreground/60 text-sm">
                    We sent a link to{" "}
                    <span className="font-medium text-foreground">
                      {email || "your inbox"}
                    </span>
                    . Click it to continue.
                  </p>
                </motion.div>

                <motion.div
                  animate={animate}
                  className="mt-8 flex flex-col gap-3"
                  initial={initial}
                  transition={item}
                >
                  <Button type="button" variant="outline">
                    Resend link
                  </Button>
                  <button
                    className="inline-flex items-center justify-center gap-1 text-foreground/60 text-sm hover:text-foreground"
                    onClick={handleUseDifferentEmail}
                    type="button"
                  >
                    <ArrowLeft className="size-3.5" />
                    Use a different email
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default MagicLink;
