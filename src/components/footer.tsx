import React from "react"

// You can adjust the path or use Tailwind for font if needed
const gifUrl = "/smoothiegif.webp"

export default function Footer() {
  return (
    <footer
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
          <img
            src={gifUrl}
            alt="O gif"
            className="h-[clamp(2.5rem,10vw,5rem)] w-[clamp(2.5rem,10vw,5rem)] rounded-full object-cover shadow-lg"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              background: "#000",
            }}
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
        href="https://x.com/educalvolpz"
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
        />
        <span className="text-foreground text-sm font-bold whitespace-nowrap">
          Eduardo Calvo
        </span>
      </a>
    </footer>
  )
}
