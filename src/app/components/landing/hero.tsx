import Link from "next/link"
import { ArrowRight } from "lucide-react"

import Divider from "@/app/components/landing/divider"
import { ReactLogo } from "@/app/components/resources/logos/ReactLogo"
import { TailwindLogo } from "@/app/components/resources/logos/TailwindLogo"
import AppleInvites, {
  Event,
} from "@/app/doc/_components/smoothui/AppleInvites"

import { Button } from "../button"
import Logo from "../logo"
import GithubStars from "./githubstars"
import Rule from "./rule"

const demoEvents: Event[] = [
  {
    id: 1,
    subtitle: "Bring your UI to life with smooth, modern motion.",
    location: "Powered by Framer Motion",
    backgroundClassName: "bg-gradient-to-br from-[#4B94FD]  to-[#1477F6]",
    badge: "SmoothUI",
  },
  {
    id: 2,
    subtitle: "Tweak every detail to match your brand.",
    location: "Themeable & Flexible",
    backgroundClassName: "bg-gradient-to-br from-[#A764FF] to-[#6E48EC]",
    badge: "Customizable",
  },
  {
    id: 3,
    subtitle: "A collection of stunning, ready-to-use UI blocks.",
    location: "Pixel-perfect Design",
    backgroundClassName: "bg-gradient-to-br from-[#FD4B4E] to-[#F61418]",
    badge: "Beautiful",
  },
  {
    id: 4,
    subtitle: "Easy to use, well-documented, and TypeScript ready.",
    location: "Built for React & Tailwind CSS",
    backgroundClassName: "bg-gradient-to-br from-[#FF8743] to-[#FF5C00]",
    badge: "Easy",
  },
]
export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-row items-center justify-between px-4">
      <Rule position="bottom-right" />
      <Rule position="bottom-left" />
      <Divider />
      <div className="flex h-full flex-col items-start justify-start">
        <Logo />
        <h1 className="sr-only">SmoothUI</h1>
        <p className="text-primary-foreground mt-6 max-w-2xl text-left text-xl transition">
          A collection of{" "}
          <span className="decoration-candy-secondary line-through">
            awesome
          </span>{" "}
          test components
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

        <div className="text-primary-foreground mt-14 hidden cursor-default items-center justify-start gap-3 text-xs font-medium tracking-widest uppercase transition sm:flex sm:justify-center">
          <span>Built for</span>
          <span className="group flex items-center gap-1.5">
            <ReactLogo className="text-smooth-700 group-hover:text-candy h-6 transition" />
            <span className="group-hover:text-candy">React</span>
          </span>
          <span className="group flex items-center gap-1.5">
            <TailwindLogo className="text-smooth-700 group-hover:text-candy h-5 transition" />
            <span className="group-hover:text-candy">Tailwind CSS</span>
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <AppleInvites cardWidth={200} cardHeight={200} events={demoEvents} />
      </div>
    </section>
  )
}
