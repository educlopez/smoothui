"use client";

import { Button } from "@repo/shadcn-ui/components/ui/button";
import { cn } from "@repo/shadcn-ui/lib/utils";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const menuItems = [
  { id: "features", name: "Features", href: "#link" },
  { id: "pricing", name: "Pricing", href: "#link" },
  { id: "about", name: "About", href: "#link" },
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
  const [menuState, setMenuState] = useState(false);

  return (
    <div className="relative">
      <header>
        <nav className="absolute top-0 left-0 z-20 w-full transition-all duration-300">
          <div className="mx-auto max-w-5xl px-6">
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-6 transition-all duration-200 lg:gap-0">
              <div className="flex w-full justify-between gap-6 lg:w-auto">
                <a
                  aria-label="SmoothUI home"
                  className="flex items-center gap-2"
                  href="/"
                >
                  <span className="sr-only">SmoothUI</span>
                  {/* biome-ignore lint/performance/noImgElement: Rendering static brand asset from public folder */}
                  <img
                    alt="SmoothUI logo"
                    className={cn("h-6 w-auto", "dark:filter", "dark:invert")}
                    height={28}
                    src="/logo-smoothui.svg"
                    width={140}
                  />
                </a>

                <button
                  aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                  className="-m-2.5 -mr-4 relative z-20 block cursor-pointer p-2.5 lg:hidden"
                  onClick={() => setMenuState(!menuState)}
                  type="button"
                >
                  <AnimatePresence mode="wait">
                    {menuState ? (
                      <motion.div
                        animate={{ opacity: 1, rotate: 0, scale: SCALE_MAX }}
                        exit={{
                          opacity: 0,
                          rotate: -ROTATION_ANGLE,
                          scale: SCALE_MIN,
                        }}
                        initial={{
                          opacity: 0,
                          rotate: ROTATION_ANGLE,
                          scale: SCALE_MIN,
                        }}
                        key="close"
                        transition={{
                          duration: ANIMATION_DURATION,
                          ease: EASE_OUT_QUART,
                        }}
                      >
                        <X className="m-auto size-6" />
                      </motion.div>
                    ) : (
                      <motion.div
                        animate={{ opacity: 1, rotate: 0, scale: SCALE_MAX }}
                        exit={{
                          opacity: 0,
                          rotate: ROTATION_ANGLE,
                          scale: SCALE_MIN,
                        }}
                        initial={{
                          opacity: 0,
                          rotate: -ROTATION_ANGLE,
                          scale: SCALE_MIN,
                        }}
                        key="menu"
                        transition={{
                          duration: ANIMATION_DURATION,
                          ease: EASE_OUT_QUART,
                        }}
                      >
                        <Menu className="m-auto size-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                <div className="m-auto hidden size-fit lg:block">
                  <ul className="flex gap-1">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <Button asChild size="sm" variant="ghost">
                          <a className="text-base" href={item.href}>
                            <span>{item.name}</span>
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <AnimatePresence>
                {menuState && (
                  <motion.div
                    animate={{ opacity: 1, y: 0, scale: SCALE_MAX }}
                    className="mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border bg-background p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent"
                    exit={{ opacity: 0, y: TRANSLATE_Y_OFFSET, scale: 0.95 }}
                    initial={{ opacity: 0, y: TRANSLATE_Y_OFFSET, scale: 0.95 }}
                    transition={{
                      duration: ANIMATION_DURATION,
                      ease: EASE_OUT_QUART,
                    }}
                  >
                    <div className="lg:hidden">
                      <ul className="space-y-6 text-base">
                        {menuItems.map((item, index) => (
                          <motion.li
                            animate={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: TRANSLATE_X_OFFSET }}
                            key={item.id}
                            transition={{
                              delay: index * STAGGER_DELAY,
                              duration: ANIMATION_DURATION,
                              ease: EASE_OUT_QUART,
                            }}
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
                      animate={{ opacity: 1, y: 0 }}
                      className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit"
                      initial={{ opacity: 0, y: 10 }}
                      transition={{
                        delay: menuItems.length * STAGGER_DELAY + STAGGER_DELAY,
                        duration: ANIMATION_DURATION,
                        ease: EASE_OUT_QUART,
                      }}
                    >
                      <Button
                        onClick={() => setMenuState(false)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        <span>Login</span>
                      </Button>
                      <Button
                        onClick={() => setMenuState(false)}
                        size="sm"
                        type="button"
                      >
                        <span>Sign Up</span>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};
