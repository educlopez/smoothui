"use client";

import SmoothButton from "@repo/smoothui/components/smooth-button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

const actionItems = [
  { href: "#login", id: "login", name: "Login", variant: "ghost" },
  { href: "#signup", id: "signup", name: "Sign Up", variant: undefined },
] as const;

const menuItems = [
  { href: "#link", id: "features", name: "Features" },
  { href: "#link", id: "pricing", name: "Pricing" },
  { href: "#link", id: "about", name: "About" },
];

// Animation constants
const ANIMATION_DURATION = 0.2;
const STAGGER_DELAY = 0.05;
const EASE_OUT_QUART_X1 = 0.22;
const EASE_OUT_QUART_Y1 = 1;
const EASE_OUT_QUART_X2 = 0.36;
const EASE_OUT_QUART_Y2 = 1;
const EASE_OUT_QUART = [
  EASE_OUT_QUART_X1,
  EASE_OUT_QUART_Y1,
  EASE_OUT_QUART_X2,
  EASE_OUT_QUART_Y2,
] as const;
const ROTATION_ANGLE = 180;
const SCALE_MIN = 0;
const SCALE_MAX = 1;
const TRANSLATE_Y_OFFSET = -10;
const TRANSLATE_X_OFFSET = -10;

export const HeroHeader = () => {
  const shouldReduceMotion = useReducedMotion();
  const [menuState, setMenuState] = useState(false);
  const menuId = useId();

  // Login / Sign Up are navigation, so they render as links. On desktop they
  // sit in the bar; on mobile they live inside the menu panel.
  const renderActions = (onNavigate?: () => void) =>
    actionItems.map((action) => (
      <SmoothButton asChild key={action.id} size="sm" variant={action.variant}>
        <a href={action.href} onClick={onNavigate}>
          <span>{action.name}</span>
        </a>
      </SmoothButton>
    ));

  return (
    <div className="relative">
      <header>
        <nav className="absolute top-0 left-0 z-20 w-full transition-all duration-300">
          <div className="mx-auto max-w-5xl px-6">
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-6 transition-all duration-200 lg:gap-0">
              <div className="flex w-full justify-between gap-6 lg:w-auto">
                <a className="flex items-center gap-2" href="/">
                  {/* Text wordmark: an image under /brand only exists on
                      smoothui.dev, so it broke in installed projects. */}
                  <span className="font-semibold font-title text-foreground text-lg tracking-tight">
                    SmoothUI
                  </span>
                </a>

                <SmoothButton
                  aria-controls={menuId}
                  aria-expanded={menuState}
                  aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block lg:hidden"
                  onClick={() => setMenuState(!menuState)}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <AnimatePresence mode="wait">
                    {menuState ? (
                      <motion.div
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, rotate: 0, scale: SCALE_MAX }
                        }
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0, transition: { duration: 0 } }
                            : {
                                opacity: 0,
                                rotate: -ROTATION_ANGLE,
                                scale: SCALE_MIN,
                              }
                        }
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : {
                                opacity: 0,
                                rotate: ROTATION_ANGLE,
                                scale: SCALE_MIN,
                              }
                        }
                        key="close"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                duration: ANIMATION_DURATION,
                                ease: EASE_OUT_QUART,
                              }
                        }
                      >
                        <X className="m-auto size-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, rotate: 0, scale: SCALE_MAX }
                        }
                        exit={
                          shouldReduceMotion
                            ? { opacity: 0, transition: { duration: 0 } }
                            : {
                                opacity: 0,
                                rotate: ROTATION_ANGLE,
                                scale: SCALE_MIN,
                              }
                        }
                        initial={
                          shouldReduceMotion
                            ? { opacity: 1 }
                            : {
                                opacity: 0,
                                rotate: -ROTATION_ANGLE,
                                scale: SCALE_MIN,
                              }
                        }
                        key="menu"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : {
                                duration: ANIMATION_DURATION,
                                ease: EASE_OUT_QUART,
                              }
                        }
                      >
                        <Menu className="m-auto size-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SmoothButton>

                <div className="m-auto hidden size-fit lg:block">
                  <ul className="flex gap-1">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <SmoothButton asChild size="sm" variant="ghost">
                          <a className="text-base" href={item.href}>
                            <span>{item.name}</span>
                          </a>
                        </SmoothButton>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="hidden lg:flex lg:gap-3">{renderActions()}</div>

              <AnimatePresence>
                {menuState ? (
                  <motion.div
                    animate={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, scale: SCALE_MAX, y: 0 }
                    }
                    className="mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:hidden dark:shadow-none"
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0, transition: { duration: 0 } }
                        : { opacity: 0, scale: 0.95, y: TRANSLATE_Y_OFFSET }
                    }
                    id={menuId}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 0, scale: 0.95, y: TRANSLATE_Y_OFFSET }
                    }
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : {
                            duration: ANIMATION_DURATION,
                            ease: EASE_OUT_QUART,
                          }
                    }
                  >
                    <div>
                      <ul className="space-y-6 text-base">
                        {menuItems.map((item, index) => (
                          <motion.li
                            animate={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 1, x: 0 }
                            }
                            initial={
                              shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 0, x: TRANSLATE_X_OFFSET }
                            }
                            key={item.id}
                            transition={
                              shouldReduceMotion
                                ? { duration: 0 }
                                : {
                                    delay: index * STAGGER_DELAY,
                                    duration: ANIMATION_DURATION,
                                    ease: EASE_OUT_QUART,
                                  }
                            }
                          >
                            <a
                              className="block text-muted-foreground duration-150 hover:text-accent-foreground"
                              href={item.href}
                              onClick={() => setMenuState(false)}
                            >
                              <span>{item.name}</span>
                            </a>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 1, y: 0 }
                      }
                      className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit"
                      initial={
                        shouldReduceMotion
                          ? { opacity: 1 }
                          : { opacity: 0, y: 10 }
                      }
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              delay:
                                menuItems.length * STAGGER_DELAY +
                                STAGGER_DELAY,
                              duration: ANIMATION_DURATION,
                              ease: EASE_OUT_QUART,
                            }
                      }
                    >
                      {renderActions(() => setMenuState(false))}
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};
