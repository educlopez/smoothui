import Image from "next/image"
import { Pizza } from "lucide-react"

export default function Footer() {
  return (
    <footer className="mb-10 flex flex-col items-center justify-center gap-4 py-10">
      <div className="text-light11 dark:text-dark11 flex flex-col gap-2 text-center text-sm transition">
        <p>
          Made with <Pizza size={14} className="inline" /> by
        </p>
        <a
          href="https://x.com/educalvolpz"
          aria-label="X Profile Eduardo Calvo"
          target="_blank"
          className="items-align-center group text-light12 dark:text-dark12 flex flex-row items-center justify-center gap-2 transition hover:text-pink-500 dark:hover:text-pink-500"
        >
          <div className="shadow-neutral-soft group-hover:shadow-neutral-soft-hover bg-light1 dark:bg-dark1 flex h-8 w-8 shrink-0 gap-2 rounded-full p-0.5">
            <Image
              src="/pixel-edu-calvo.png"
              alt="avatar Edu"
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
