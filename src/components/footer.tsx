import Image from "next/image"
import Link from "next/link"
// import AirlumeIcon from "@/assets/images/airlume.png"
import SparkbitesIcon from "@/assets/images/sparkbites.png"

import Divider from "./landing/divider"
import Rule from "./landing/rule"

export default function Footer() {
  return (
    <footer className="z-20 flex flex-col items-center justify-center text-center text-base">
      <div className="relative flex w-full flex-col items-center justify-center gap-2 px-2 py-10">
        <p className="text-primary-foreground text-xs">I ALSO BUILD:</p>
        <div className="flex flex-row items-center justify-center gap-2 text-xs md:gap-8">
          <Link
            href="https://sparkbites.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-primary hover:shadow-custom flex items-center gap-2 rounded-md p-2 transition-colors"
          >
            <Image
              src={SparkbitesIcon.src}
              alt="Sparkbites"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <div className="flex max-w-[200px] flex-col items-start justify-start text-left">
              <p className="text-foreground font-bold">Sparkbites</p>
              <p className="text-primary-foreground text-xs">
                Inspiration directory for your next project
              </p>
            </div>
          </Link>
          {/* <Link
            href="https://airlume.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-primary hover:shadow-custom flex items-center gap-2 rounded-md p-2 transition-colors"
          >
            <Image
              src={AirlumeIcon.src}
              alt="Sparkbites"
              width={20}
              height={20}
              className="h-5 w-5"
            />
            <div className="flex max-w-[200px] flex-col items-start justify-start text-left">
              <p className="text-foreground font-bold">Airlume</p>
              <p className="text-primary-foreground text-xs">
                Viral posts in seconds with AI
              </p>
            </div>
          </Link> */}
        </div>
        <Divider />
      </div>

      <div className="bg-background relative flex w-full flex-col items-center justify-center gap-2 px-2 py-10">
        <Divider orientation="vertical" />
        <Divider orientation="vertical" className="right-auto left-0" />
        <a
          href="https://x.com/educalvolpz"
          target="_blank"
          rel="noopener noreferrer"
          className="group text-foreground hover:bg-primary hover:shadow-custom relative mx-auto mt-4 mb-20 flex w-fit flex-row items-center justify-center gap-2 rounded-sm p-2"
        >
          <p className="text-xs whitespace-nowrap">Made by</p>
          <div className="flex h-6 w-6 shrink-0 gap-2 rounded-full">
            <Image
              src="https://github.com/educlopez.png"
              alt="User Avatar of Eduardo Calvo"
              width={28}
              height={28}
              className="shrink-0 rounded-md"
            />
          </div>
          <p className="text-xs font-bold whitespace-nowrap">Eduardo Calvo</p>
        </a>
      </div>
    </footer>
  )
}
