"use client";

import { Github, Linkedin, Twitter, Youtube } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ANIMATION_DURATION = 0.25;
const DELAY_INCREMENT = 0.05;
const HOVER_SCALE = 1.1;
const TAP_SCALE = 0.95;
const DELAY_NEWSLETTER = 6;
const DELAY_BOTTOM = 7;

export type FooterMegaProps = {
  logo?: ReactNode;
  description?: string;
  columns?: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  newsletter?: {
    title: string;
    description: string;
    placeholder: string;
    buttonText: string;
  };
  socialLinks?: Array<{
    icon: ReactNode;
    href: string;
    label: string;
  }>;
  copyright?: string;
};

const defaultColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
      { label: "Documentation", href: "#docs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Community", href: "#community" },
      { label: "GitHub", href: "#github" },
      { label: "Discord", href: "#discord" },
      { label: "Help Center", href: "#help" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
    ],
  },
];

const defaultSocialLinks = [
  {
    icon: <Twitter className="h-5 w-5" />,
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    icon: <Github className="h-5 w-5" />,
    href: "https://github.com",
    label: "GitHub",
  },
  {
    icon: <Linkedin className="h-5 w-5" />,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: <Youtube className="h-5 w-5" />,
    href: "https://youtube.com",
    label: "YouTube",
  },
];

export const FooterMega = ({
  logo = <span className="font-bold text-2xl text-foreground">SmoothUI</span>,
  description = "Beautiful animated React components for building modern user interfaces with smooth animations and delightful interactions.",
  columns = defaultColumns,
  newsletter = {
    title: "Subscribe to our newsletter",
    description: "Get the latest updates and news delivered to your inbox.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
  },
  socialLinks = defaultSocialLinks,
  copyright = "© 2024 SmoothUI. All rights reserved.",
}: FooterMegaProps) => {
  const shouldReduceMotion = useReducedMotion();

  const getAnimationProps = (delay = 0) => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 },
      };
    }

    return {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: {
        type: "spring" as const,
        duration: ANIMATION_DURATION,
        bounce: 0.1,
        delay,
      },
    };
  };

  const getHoverProps = () => {
    if (shouldReduceMotion) {
      return {};
    }

    return {
      whileHover: { scale: HOVER_SCALE },
      whileTap: { scale: TAP_SCALE },
    };
  };

  return (
    <footer className="border-border border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Top Section: Logo, Description, Columns, Newsletter */}
        <motion.div
          {...getAnimationProps()}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12"
        >
          {/* Logo and Description */}
          <motion.div
            {...getAnimationProps(DELAY_INCREMENT)}
            className="lg:col-span-3"
          >
            <div className="mb-4">{logo}</div>
            <p className="text-foreground/70 text-sm leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Link Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-5">
            {columns.map((column, columnIndex) => (
              <motion.div
                key={column.title}
                {...getAnimationProps(DELAY_INCREMENT * (columnIndex + 2))}
              >
                <h4 className="mb-4 font-semibold text-foreground text-sm uppercase tracking-wide">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        className="text-foreground/70 text-sm transition-colors hover:text-brand"
                        href={link.href}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter */}
          <motion.div
            {...getAnimationProps(DELAY_INCREMENT * DELAY_NEWSLETTER)}
            className="lg:col-span-4"
          >
            <h4 className="mb-2 font-semibold text-foreground text-lg">
              {newsletter.title}
            </h4>
            <p className="mb-4 text-foreground/70 text-sm">
              {newsletter.description}
            </p>
            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                aria-label="Email address"
                className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-foreground/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                placeholder={newsletter.placeholder}
                type="email"
              />
              <motion.button
                className="rounded-lg bg-brand px-6 py-2.5 font-medium text-background text-sm transition-colors hover:bg-brand/90"
                type="submit"
                {...(shouldReduceMotion
                  ? {}
                  : {
                      whileHover: { scale: 1.02 },
                      whileTap: { scale: 0.98 },
                    })}
              >
                {newsletter.buttonText}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        {/* Bottom Section: Copyright and Social Links */}
        <motion.div
          {...getAnimationProps(DELAY_INCREMENT * DELAY_BOTTOM)}
          className="mt-12 flex flex-col items-center justify-between gap-6 border-border border-t pt-8 sm:flex-row"
        >
          <p className="text-foreground/60 text-sm">{copyright}</p>

          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <motion.a
                aria-label={social.label}
                className="text-foreground/60 transition-colors hover:text-brand"
                href={social.href}
                key={social.label}
                rel="noopener noreferrer"
                target="_blank"
                {...getHoverProps()}
              >
                {social.icon}
                <span className="sr-only">{social.label}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default FooterMega;
