"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Book,
  Layers3,
  LayoutDashboard,
  Menu,
  MessageCircle,
  PackagePlus,
  Sparkles,
  Type,
  User,
  X,
  Zap,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/button"
import { GithubStars } from "@/components/landing/githubstars"
import Logo from "@/components/logo"

interface MobileNavbarProps {
  className?: string
}

export function MobileNavbar({ className }: MobileNavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("mobile-navbar", className)}>
      <div className="mobile-navbar-header">
        <div className="flex gap-2">
          <Logo />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="mobile-menu-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="mobile-navbar-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.22, 1, 0.36, 1], // ease-out-quart
            }}
          >
            <motion.div
              className="mobile-navbar-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.2 }}
            >
              <div className="mobile-navbar-section-title">
                <LayoutDashboard size={16} />
                Components
              </div>
              <div className="mobile-navbar-links">
                <Link href="/doc/text" className="mobile-navbar-link">
                  <Type size={16} />
                  Text Components
                </Link>
                <Link href="/doc/basic" className="mobile-navbar-link">
                  <Layers3 size={16} />
                  Basic Components
                </Link>
                <Link href="/doc/components" className="mobile-navbar-link">
                  <LayoutDashboard size={16} />
                  UI Components
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="mobile-navbar-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <div className="mobile-navbar-section-title">
                <Zap size={16} />
                Blocks
              </div>
              <div className="mobile-navbar-links">
                <Link href="/doc/blocks/hero" className="mobile-navbar-link">
                  <Sparkles size={16} />
                  Hero Blocks
                </Link>
                <Link href="/doc/blocks/pricing" className="mobile-navbar-link">
                  <PackagePlus size={16} />
                  Pricing Blocks
                </Link>
                <Link
                  href="/doc/blocks/testimonial"
                  className="mobile-navbar-link"
                >
                  <User size={16} />
                  Testimonial Blocks
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="mobile-navbar-links"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <Link href="/doc" className="mobile-navbar-link">
                <Book size={16} />
                Docs
              </Link>
              <Link
                href="https://github.com/educlopez/smoothui/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-navbar-link"
              >
                <MessageCircle size={16} />
                Feedback
              </Link>
            </motion.div>

            <motion.div
              className="mobile-navbar-footer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <GithubStars />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
