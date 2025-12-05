"use client";

import { getImageKitUrl } from "@smoothui/data";
import { motion } from "motion/react";
import { AnimatedGroup, AnimatedText, Button, HeroHeader } from "../shared";

type HeroProductProps = {
  badgeText?: string;
  heading?: string;
  description?: string;
  primaryButton?: {
    text: string;
    url: string;
  };
  secondaryButton?: {
    text: string;
    url: string;
  };
  imageSrc?: string;
  imageAlt?: string;
};

export function HeroProduct({
  badgeText = "New animation library",
  heading = "Build Beautiful UIs, Effortlessly",
  description = "Craft. Build. Ship Modern Websites With Smooth Animations.",
  primaryButton = {
    text: "Start Building",
    url: "#link",
  },
  secondaryButton = {
    text: "Watch Video",
    url: "#link",
  },
  imageSrc = getImageKitUrl("/images/hero-smoothui.png"),
  imageAlt = "SmoothUI desktop application interface",
}: HeroProductProps) {
  return (
    <div className="relative">
      <HeroHeader />
      <main>
        <motion.section
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden"
          initial={{ opacity: 0, scale: 1.02 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94], // ease-out-quad
          }}
        >
          <div className="py-20 md:py-36">
            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
              <AnimatedGroup className="space-y-8" preset="blur-slide">
                {/* Badge with animated sparkle */}
                <motion.div
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <a
                    className="mx-auto flex w-fit items-center justify-center gap-2 rounded-md py-0.5 pr-3 pl-1 transition-colors duration-200 ease-out hover:bg-foreground/5"
                    href="#"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-auto"
                      fill="none"
                      viewBox="0 0 82 30"
                      width="200"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M23.81 14.013v.013l-1.075 4.665c-.058.264-.322.458-.626.458H20.81a.218.218 0 0 0-.208.155c-1.198 4.064-2.82 6.858-4.962 8.535-1.822 1.428-4.068 2.093-7.069 2.093-2.696 0-4.514-.867-6.056-2.578C.478 25.09-.364 21.388.146 16.926 1.065 8.549 5.41.096 13.776.096c2.545-.023 4.543.762 5.933 2.33 1.47 1.657 2.216 4.154 2.22 7.421a.55.55 0 0 1-.549.536h-6.13a.42.42 0 0 1-.407-.41c-.05-2.259-.72-3.36-2.052-3.36-2.35 0-3.736 3.19-4.471 4.959-1.027 2.47-1.55 5.152-1.447 7.824.049 1.244.249 2.994 1.43 3.718 1.047.643 2.541.217 3.446-.495.904-.711 1.632-1.942 1.938-3.065.043-.156.046-.277.005-.332-.043-.055-.162-.068-.253-.068h-1.574a.572.572 0 0 1-.438-.202.42.42 0 0 1-.087-.362l1.076-4.674c.053-.24.27-.42.537-.453v-.011h10.33c.024 0 .049 0 .072.005.268.034.457.284.452.556h.002Z"
                        fill="#0ae448"
                      />
                      <path
                        d="M41.594 8.65a.548.548 0 0 1-.548.531H35.4c-.37 0-.679-.3-.679-.665 0-1.648-.57-2.45-1.736-2.45s-1.918.717-1.94 1.968c-.025 1.395.764 2.662 3.01 4.84 2.957 2.774 4.142 5.232 4.085 8.48C38.047 26.605 34.476 30 29.042 30c-2.775 0-4.895-.743-6.305-2.207-1.431-1.486-2.087-3.668-1.95-6.485a.548.548 0 0 1 .549-.53h5.84a.55.55 0 0 1 .422.209.48.48 0 0 1 .106.384c-.065 1.016.112 1.775.512 2.195.256.272.613.41 1.058.41 1.079 0 1.711-.763 1.735-2.09.02-1.148-.343-2.155-2.321-4.19-2.555-2.496-4.846-5.075-4.775-9.13.042-2.351.976-4.502 2.631-6.056C28.294.868 30.687 0 33.465 0c2.783.02 4.892.813 6.269 2.359 1.304 1.466 1.932 3.582 1.862 6.29h-.002Z"
                        fill="#0ae448"
                      />
                      <path
                        d="m59.096 29.012.037-27.932a.525.525 0 0 0-.529-.533h-8.738c-.294 0-.423.252-.507.42L36.707 28.842v.005l-.005.006c-.14.343.126.71.497.71h6.108c.33 0 .548-.1.656-.308l1.213-2.915c.149-.388.177-.424.601-.424h5.836c.406 0 .415.008.408.405l-.131 2.71a.525.525 0 0 0 .529.532h6.17a.522.522 0 0 0 .403-.182.458.458 0 0 0 .104-.369Zm-10.81-9.326c-.057 0-.102-.001-.138-.005a.146.146 0 0 1-.13-.183c.012-.041.029-.095.053-.163l4.377-10.827c.038-.107.086-.212.136-.314.071-.145.157-.155.184-.047.023.09-.502 11.118-.502 11.118-.041.413-.06.43-.467.464l-3.509-.041h-.008l.003-.002Z"
                        fill="#0ae448"
                      />
                      <path
                        d="M71.545.547h-4.639c-.245 0-.52.13-.585.422l-6.455 28.029a.423.423 0 0 0 .088.364.572.572 0 0 0 .437.202h5.798c.311 0 .525-.153.583-.418 0 0 .703-3.168.704-3.178.05-.247-.036-.439-.258-.555-.105-.054-.209-.108-.312-.163l-1.005-.522-1-.522-.387-.201a.186.186 0 0 1-.102-.17.199.199 0 0 1 .198-.194l3.178.014c.95.005 1.901-.062 2.836-.234 6.58-1.215 10.95-6.485 11.076-13.656.107-6.12-3.309-9.221-10.15-9.221l-.005.003Zm-1.579 16.68h-.124c-.278 0-.328-.03-.337-.04-.004-.007 1.833-8.073 1.834-8.084.047-.233.045-.367-.099-.446-.184-.102-2.866-1.516-2.866-1.516a.188.188 0 0 1-.101-.172.197.197 0 0 1 .197-.192h4.241c1.32.04 2.056 1.221 2.021 3.237-.061 3.492-1.721 7.09-4.766 7.214Z"
                        fill="#0ae448"
                      />
                    </svg>

                    <span className="font-medium">{badgeText}</span>
                  </a>
                </motion.div>

                {/* Main heading with staggered animation */}
                <AnimatedText
                  as="h1"
                  className="mx-auto mt-8 max-w-3xl text-balance font-bold text-4xl tracking-tight sm:text-5xl"
                  delay={0.2}
                >
                  {heading}
                </AnimatedText>

                {/* Description */}
                <AnimatedText
                  as="p"
                  className="mx-auto my-6 max-w-xl text-balance text-muted-foreground text-xl"
                  delay={0.3}
                >
                  {description}
                </AnimatedText>

                {/* CTA buttons with staggered animation */}
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <motion.div
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild size="lg" variant="candy">
                      <a href={primaryButton.url}>
                        <span className="text-nowrap">
                          {primaryButton.text}
                        </span>
                      </a>
                    </Button>
                  </motion.div>

                  <motion.div
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild size="lg" variant="outline">
                      <a href={secondaryButton.url}>
                        <span className="text-nowrap">
                          {secondaryButton.text}
                        </span>
                      </a>
                    </Button>
                  </motion.div>
                </motion.div>
              </AnimatedGroup>
            </div>

            {/* Image section with parallax-like animation */}
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="relative"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{
                duration: 0.8,
                delay: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="relative z-10 mx-auto max-w-5xl px-6">
                <motion.div
                  className="mt-12 md:mt-16"
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  whileHover={{
                    scale: 1.02,
                    rotateY: 2,
                  }}
                >
                  <motion.div
                    className="relative mx-auto overflow-hidden rounded-(--radius) border border-transparent bg-background shadow-black/10 shadow-lg ring-1 ring-black/10"
                    initial={{
                      boxShadow:
                        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1)",
                    }}
                    transition={{
                      duration: 0.3,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    whileHover={{
                      boxShadow:
                        "0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <motion.div
                      animate={{ scale: 1 }}
                      initial={{ scale: 1.05 }}
                      transition={{
                        duration: 1.2,
                        delay: 0.8,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <img
                        alt={imageAlt}
                        className="h-auto w-full"
                        height="1842"
                        src={imageSrc}
                        width="2880"
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default HeroProduct;
