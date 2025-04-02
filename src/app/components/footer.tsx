import Image from "next/image"
import { Pizza } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mb-10 flex flex-col items-center justify-center gap-4 py-10">
      <div className="text-light-900 dark:text-dark-900 flex flex-col gap-2 text-center text-sm transition">
        <p>
          Made with <Pizza size={14} className="inline" aria-hidden="true" /> by
        </p>
        <a
          href="https://x.com/educalvolpz"
          target="_blank"
          rel="noopener noreferrer"
          className="items-align-center group text-light-950 dark:text-dark-950 flex flex-row items-center justify-center gap-2 transition hover:text-pink-500 dark:hover:text-pink-500"
        >
          <div className="shadow-neutral-soft group-hover:shadow-neutral-soft-hover bg-light-50 dark:bg-dark-50 flex h-8 w-8 shrink-0 gap-2 rounded-full">
            <Image
              src="https://github.com/educlopez.png"
              alt="User Avatar of Eduardo Calvo"
              width={56}
              height={56}
              className="shrink-0 rounded-full"
            />
          </div>
          <p className="font-bold">Eduardo Calvo</p>
        </a>
      </div>
    </footer>
  )
}
