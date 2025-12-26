"use client";

import { getImageKitUrl } from "@smoothui/data";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-12 pb-16">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-black font-title text-[clamp(3rem,20vw,12rem)] text-foreground/5 uppercase"
      >
        SmoothUI
      </span>
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <a
          className="group my-10 flex items-center gap-2 rounded-sm px-3 py-2 hover:bg-primary hover:shadow-custom hover:backdrop-blur-xs"
          href="https://x.com/educalvolpz"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="whitespace-nowrap text-foreground text-sm">
            Made by
          </span>
          <Image
            alt="User Avatar of Eduardo Calvo"
            className="h-7 w-7 shrink-0 rounded-md"
            height={32}
            loading="lazy"
            src={getImageKitUrl("https://ik.imagekit.io/16u211libb/avatar-educalvolpz.jpeg?updatedAt=1765524159631", {
              width: 64,
              height: 64,
              quality: 85,
              format: "auto",
            })}
            width={32}
          />
          <span className="whitespace-nowrap font-medium text-foreground text-sm">
            Eduardo Calvo
          </span>
        </a>
      </div>
    </footer>
  );
}
