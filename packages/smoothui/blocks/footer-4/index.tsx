"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ANIMATION_DURATION = 0.25;
const HOVER_SCALE = 1.08;
const TAP_SCALE = 0.95;

export interface FooterMinimalProps {
  logo?: ReactNode;
  links?: Array<{ label: string; href: string }>;
  socialLinks?: Array<{
    icon: ReactNode;
    href: string;
    label: string;
  }>;
  copyright?: string;
}

const defaultLinks = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Contact", href: "#contact" },
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
];

export const FooterMinimal = ({
  logo = <span className="font-bold text-foreground text-xl">SmoothUI</span>,
  links = defaultLinks,
  socialLinks = defaultSocialLinks,
  copyright = "© 2024 SmoothUI",
}: FooterMinimalProps) => {
  const shouldReduceMotion = useReducedMotion();

  const getAnimationProps = () => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        transition: { duration: 0 },
      };
    }

    return {
      initial: { opacity: 0, y: 10 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: {
        type: "spring" as const,
        duration: ANIMATION_DURATION,
        bounce: 0.1,
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
      <div className="mx-auto max-w-7xl px-6 py-6">
        <motion.div
          {...getAnimationProps()}
          className="flex flex-col items-center justify-between gap-6 md:flex-row"
        >
          {/* Logo and Copyright */}
          <div className="flex items-center gap-3">
            <div>{logo}</div>
            <span className="text-foreground/50">|</span>
            <span className="text-foreground/60 text-sm">{copyright}</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {links.map((link) => (
              <a
                className="relative text-foreground/70 text-sm transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-200 hover:text-foreground hover:after:w-full"
                href={link.href}
                key={link.label}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-4">
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

export default FooterMinimal;
