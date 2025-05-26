import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Divider from "@/app/components/landing/divider"
import { ReactLogo } from "@/app/components/resources/logos/ReactLogo"
import { TailwindLogo } from "@/app/components/resources/logos/TailwindLogo"
import AppleInvites from "@/app/doc/_components/ui/AppleInvites"

import { Button } from "../button"
import Logo from "../logo"
import GithubStars from "./githubstars"
import Rule from "./rule"

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-row items-center justify-between px-4">
      <Rule position="bottom-right" />
      <Rule position="bottom-left" />
      <Divider />
      <div className="flex h-full flex-col items-start justify-start">
        <Logo />
        <h1 className="sr-only">SmoothUI</h1>
        <p className="text-smooth-900 mt-6 max-w-2xl text-left text-xl transition">
          A collection of{" "}
          <span className="line-through decoration-pink-500">awesome</span> test
          components
          <br /> with smooth animations
        </p>
        <div className="mt-10 flex gap-4">
          <Button variant="candy" asChild>
            <Link href="/doc">
              Get Started
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <GithubStars />
        </div>

        <div className="text-smooth-900 mt-14 hidden cursor-default items-center justify-start gap-3 text-xs font-medium tracking-widest uppercase transition sm:flex sm:justify-center">
          <span>Built for</span>
          <span className="group flex items-center gap-1.5">
            <ReactLogo className="text-smooth-700 h-6 transition group-hover:text-pink-500 dark:group-hover:text-pink-500" />
            <span className="group-hover:text-pink-500 dark:group-hover:text-pink-500">
              React
            </span>
          </span>
          <span className="group flex items-center gap-1.5">
            <TailwindLogo className="text-smooth-700 h-5 transition group-hover:text-pink-500 dark:group-hover:text-pink-500" />
            <span className="group-hover:text-pink-500 dark:group-hover:text-pink-500">
              Tailwind CSS
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <AppleInvites />
      </div>
    </section>
  )
}
