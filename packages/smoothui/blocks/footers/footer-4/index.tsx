"use client";

import { Github, Linkedin, Twitter } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const ANIMATION_DURATION = 0.25;
const HOVER_SCALE = 1.08;
const TAP_SCALE = 0.95;

export interface FooterMinimalProps {
  copyright?: string;
  links?: Array<{ label: string; href: string }>;
  logo?: ReactNode;
  socialLinks?: Array<{
    icon: ReactNode;
    href: string;
    label: string;
  }>;
}

const defaultLinks = [
  { href: "#privacy", label: "Privacy" },
  { href: "#terms", label: "Terms" },
  { href: "#contact", label: "Contact" },
];

const defaultSocialLinks = [
  {
    href: "https://twitter.com",
    icon: <Twitter className="h-5 w-5" />,
    label: "Twitter",
  },
  {
    href: "https://github.com",
    icon: <Github className="h-5 w-5" />,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com",
    icon: <Linkedin className="h-5 w-5" />,
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
        animate: { opacity: 1 },
        initial: { opacity: 1 },
        transition: { duration: 0 },
      };
    }

    return {
      initial: { opacity: 0, y: 10 },
      transition: {
        bounce: 0.1,
        duration: ANIMATION_DURATION,
        type: "spring" as const,
      },
      viewport: { once: true },
      whileInView: { opacity: 1, y: 0 },
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
