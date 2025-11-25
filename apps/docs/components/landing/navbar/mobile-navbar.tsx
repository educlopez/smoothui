"use client";

import Logo from "@docs/components/logo";
import { Button } from "@docs/components/smoothbutton";
import {
  Book,
  Heart,
  Layers3,
  LayoutDashboard,
  Menu,
  PackagePlus,
  Sparkles,
  Type,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GithubStars } from "./github-stars";

interface MobileNavbarProps {
  className?: string;
}

export function MobileNavbar({ className }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("mobile-navbar", className)}>
      <div className="mobile-navbar-header">
        <a className="flex gap-2" href="/">
          <Logo />
        </a>
        <Button
          aria-label="Toggle menu"
          className="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          variant="ghost"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mobile-navbar-menu"
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1], // ease-out-quart
            }}
          >
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mobile-navbar-section"
              initial={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.05, duration: 0.2 }}
            >
              <div className="mobile-navbar-section-title">
                <LayoutDashboard size={16} />
                Components
              </div>
              <div className="mobile-navbar-links">
                <Link
                  className="mobile-navbar-link"
                  href="/docs/components/scroll-reveal-paragraph"
                >
                  <Type size={16} />
                  Text Components
                </Link>
                <Link
                  className="mobile-navbar-link"
                  href="/docs/components/accordion"
                >
                  <Layers3 size={16} />
                  Basic Components
                </Link>
                <Link
                  className="mobile-navbar-link"
                  href="/docs/components/animated-o-t-p-input"
                >
                  <LayoutDashboard size={16} />
                  UI Components
                </Link>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mobile-navbar-section"
              initial={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <div className="mobile-navbar-section-title">
                <Zap size={16} />
                Blocks
              </div>
              <div className="mobile-navbar-links">
                <Link className="mobile-navbar-link" href="/docs/blocks/hero">
                  <Sparkles size={16} />
                  Hero Blocks
                </Link>
                <Link
                  className="mobile-navbar-link"
                  href="/docs/blocks/pricing"
                >
                  <PackagePlus size={16} />
                  Pricing Blocks
                </Link>
                <Link
                  className="mobile-navbar-link"
                  href="/docs/blocks/testimonial"
                >
                  <User size={16} />
                  Testimonial Blocks
                </Link>
              </div>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mobile-navbar-links"
              initial={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <Link className="mobile-navbar-link" href="/docs/guides">
                <Book size={16} />
                Docs
              </Link>
              <Link className="mobile-navbar-link" href="/docs/guides/sponsors">
                <Heart size={16} />
                Sponsors
              </Link>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mobile-navbar-footer"
              initial={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <GithubStars />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
