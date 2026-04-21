"use client";

import { Input } from "@repo/shadcn-ui/components/ui/input";
import { Label } from "@repo/shadcn-ui/components/ui/label";
import MagneticButton from "@repo/smoothui/components/magnetic-button";
import SiriOrb from "@repo/smoothui/components/siri-orb";
import SmoothButton from "@repo/smoothui/components/smooth-button";
import TypewriterText from "@repo/smoothui/components/typewriter-text";
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
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/80 p-8 shadow-black/5 shadow-xl backdrop-blur-xl">
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
                  <span className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-secondary text-white shadow-sm">
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
                  <SmoothButton
                    className="w-full gap-2"
                    size="lg"
                    type="submit"
                    variant="candy"
                  >
                    <Mail className="size-4" />
                    Send magic link
                  </SmoothButton>
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
                  className="relative flex flex-col items-center text-center"
                  initial={initial}
                  transition={item}
                >
                  {/* Ambient halo behind the mail icon */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-[-80px] flex items-center justify-center opacity-70 blur-2xl"
                  >
                    <SiriOrb animationDuration={18} size="240px" />
                  </div>
                  <motion.span
                    animate={iconAnimate}
                    className="relative flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20"
                    initial={iconInitial}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { ...SPRING, bounce: 0.1, duration: 0.3 }
                    }
                  >
                    <MailCheck className="size-6" />
                  </motion.span>
                  <h2 className="relative mt-5 font-semibold text-2xl tracking-tight">
                    Check your email
                  </h2>
                  <p className="relative mt-2 text-balance text-foreground/70 text-sm">
                    <TypewriterText key={email} speed={24}>
                      {`We just sent a secure link to ${email || "your inbox"}. Click it to continue.`}
                    </TypewriterText>
                  </p>
                </motion.div>

                <motion.div
                  animate={animate}
                  className="relative mt-8 flex flex-col gap-3"
                  initial={initial}
                  transition={item}
                >
                  <MagneticButton
                    className="w-full"
                    type="button"
                    variant="outline"
                  >
                    Resend link
                  </MagneticButton>
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
