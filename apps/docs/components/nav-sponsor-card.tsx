import Image from "next/image";
import Link from "next/link";
import { BgLines } from "./landing/bg-lines";

export function NavSponsorCard() {
  return (
    <Link
      aria-label="Visit Sparkbites inspiration directory"
      className="frame-box relative flex items-center gap-2 rounded-md border bg-linear-to-br from-background via-background to-brand/10 p-2 text-xs transition-colors"
      href="https://sparkbites.dev/"
      rel="noopener noreferrer"
      target="_blank"
    >
      <BgLines />
      <Image
        alt="Sparkbites"
        className="h-5 w-5"
        height={20}
        src="/sparkbites.png"
        width={20}
      />
      <div className="flex max-w-[200px] flex-col items-start justify-start text-left">
        <p className="font-bold text-foreground">Sparkbites</p>
        <p className="text-primary-foreground text-xs">
          Inspiration directory for your next project
        </p>
      </div>
    </Link>
  );
}
