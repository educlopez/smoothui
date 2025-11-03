"use client";

import Image from "next/image";

import { useOptimizedGif } from "../../hooks/use-optimized-gif";

// Optimized GIF loading with multiple strategies
const gifUrl =
  "https://res.cloudinary.com/dyzxnud9z/image/upload/v1758104267/smoothui/smoothiegif.webp";
const placeholderUrl = "/smoothiegif-placeholder.svg"; // Lightweight SVG placeholder

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
  });

  return (
    <footer
      className="relative flex w-full flex-col items-center justify-center overflow-hidden py-12"
      ref={footerRef}
      style={{ minHeight: 220 }}
    >
      <div className="flex w-full items-center justify-center">
        <span
          className="select-none font-black font-title text-[clamp(2.5rem,10vw,7rem)] text-foreground leading-none tracking-tight"
          style={{ letterSpacing: "0.05em" }}
        >
          SM
        </span>
        <span className="mx-1 inline-block align-middle">
          <Image
            alt="SmoothUI animated logo"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            className={`h-[clamp(2.5rem,10vw,5rem)] w-[clamp(2.5rem,10vw,5rem)] rounded-full object-cover shadow-lg transition-opacity duration-300 ${
              shouldLoad && isVisible && isLoaded ? "opacity-100" : "opacity-90"
            }`}
            height={80}
            placeholder="blur"
            priority={false}
            quality={85}
            src={src}
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              backgroundColor: "#000",
            }}
            width={80}
          />
        </span>
        <span
          className="select-none font-black text-[clamp(2.5rem,10vw,7rem)] text-foreground leading-none tracking-tight"
          style={{ letterSpacing: "0.05em" }}
        >
          OTHUI
        </span>
      </div>
      <a
        className="group my-10 flex items-center gap-2 rounded-sm px-3 py-2 hover:bg-primary hover:shadow-custom"
        href="https://x.com/educalvolopez"
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="whitespace-nowrap text-foreground text-sm">
          Made by
        </span>
        <img
          alt="User Avatar of Eduardo Calvo"
          className="h-7 w-7 shrink-0 rounded-md"
          height={32}
          loading="lazy"
          src="https://res.cloudinary.com/dyzxnud9z/image/upload/w_48,h_48,c_fill,g_auto/v1759818651/smoothui/educalvolpz.jpg"
          width={32}
        />
        <span className="whitespace-nowrap font-bold text-foreground text-sm">
          Eduardo Calvo
        </span>
      </a>
    </footer>
  );
}
