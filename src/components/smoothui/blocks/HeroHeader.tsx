"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"

const menuItems = [
  { id: "features", name: "Features", href: "#link" },
  { id: "pricing", name: "Pricing", href: "#link" },
  { id: "about", name: "About", href: "#link" },
]

export const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false)

  return (
    <div className="relative">
      <header>
        <nav className="absolute top-0 left-0 z-20 w-full transition-all duration-300">
          <div className="mx-auto max-w-5xl px-6">
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-6 transition-all duration-200 lg:gap-0">
              <div className="flex w-full justify-between gap-6 lg:w-auto">
                <Link
                  href="/"
                  aria-label="home"
                  className="flex items-center space-x-2"
                >
                  <Logo />
                </Link>

                <button
                  type="button"
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu
                    className={`m-auto size-6 duration-200 ${menuState ? "scale-0 rotate-180 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
                  />
                  <X
                    className={`absolute inset-0 m-auto size-6 duration-200 ${menuState ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-180 opacity-0"}`}
                  />
                </button>

                <div className="m-auto hidden size-fit lg:block">
                  <ul className="flex gap-1">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={item.href} className="text-base">
                            <span>{item.name}</span>
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className={`bg-background mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent ${menuState ? "block" : "hidden"}`}
              >
                <div className="lg:hidden">
                  <ul className="space-y-6 text-base">
                    {menuItems.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="#">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="#">
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
