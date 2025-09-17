"use client"

import Image from "next/image"

import { useOptimizedGif } from "@/hooks/useOptimizedGif"

// Optimized GIF loading with multiple strategies
const gifUrl = "/smoothiegif.webp"
const placeholderUrl = "/smoothiegif-placeholder.svg" // Lightweight SVG placeholder

export default function Footer() {
  const {
    shouldLoad,
    isVisible,
    isLoaded,
    src,
    ref: footerRef,
  } = useOptimizedGif({
    gifUrl,
    placeholderUrl,
    threshold: 0.1,
    rootMargin: "100px",
    enableMotion: true,
  })

  return (
    <footer
      ref={footerRef}
      className="relative flex w-full flex-col items-center justify-center overflow-hidden py-12"
      style={{ minHeight: 220 }}
    >
      <div className="flex w-full items-center justify-center">
        <span
          className="text-foreground font-title text-[clamp(2.5rem,10vw,7rem)] leading-none font-black tracking-tight select-none"
          style={{ letterSpacing: "0.05em" }}
        >
          SM
        </span>
        <span className="mx-1 inline-block align-middle">
          <Image
            src={src}
            alt="SmoothUI animated logo"
            width={80}
            height={80}
            className={`h-[clamp(2.5rem,10vw,5rem)] w-[clamp(2.5rem,10vw,5rem)] rounded-full object-cover shadow-lg transition-opacity duration-300 ${
              shouldLoad && isVisible && isLoaded ? "opacity-100" : "opacity-90"
            }`}
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              background: "#000",
            }}
            priority={false}
            quality={85}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </span>
        <span
          className="text-foreground text-[clamp(2.5rem,10vw,7rem)] leading-none font-black tracking-tight select-none"
          style={{ letterSpacing: "0.05em" }}
        >
          OTHUI
        </span>
      </div>
      <a
        href="https://x.com/educalvolopez"
        target="_blank"
        rel="noopener noreferrer"
        className="group hover:bg-primary hover:shadow-custom my-10 flex items-center gap-2 rounded-sm px-3 py-2"
      >
        <span className="text-foreground text-sm whitespace-nowrap">
          Made by
        </span>
        <img
          src="https://github.com/educlopez.png"
          alt="User Avatar of Eduardo Calvo"
          width={32}
          height={32}
          className="h-7 w-7 shrink-0 rounded-md"
          loading="lazy"
        />
        <span className="text-foreground text-sm font-bold whitespace-nowrap">
          Eduardo Calvo
        </span>
      </a>
    </footer>
  )
}
